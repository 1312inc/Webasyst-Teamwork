<?php
/**
 * Cumulative Flow Diagram, накопительная диаграмма потока.
 */
class tasksReportsCfdAction extends tasksLogAction
{
    public function execute()
    {
        if (wa()->whichUI('tasks') != '2.0') {
            throw new waException(_w('Reports are available in the Webasyst 2 interface only.'));
        }

        // Get parameters from GET/POST
        $filters = self::getFilters();
        list($start_date, $end_date, $group_by) = tasksLogChartAction::getTimeframeParams();

        $statuses = tasksHelper::getStatuses(null, false);
        $statuses[0]['params']['button_color'] = '22d13d';
        $statuses[-1]['params']['button_color'] = 'cccccc';
        list($chart_data, $timestamps) = self::getChartData($statuses, $filters, $start_date, $end_date, $group_by);

        $this->view->assign([
            'statuses'     => array_values($statuses),
            'filter_types' => self::getLogFilterTypes(),
            'filters'      => $filters,
            'start_date'   => $start_date,
            'end_date'     => $end_date,
            'chart_data'   => $chart_data,
            'group_by'     => $group_by,
            'timestamps'   => $timestamps,
        ]);
    }

    protected static function getChartData($statuses, $filters, $start_date, $end_date, $group_by)
    {
        if (!$start_date || !$end_date) {
            // paranoid; should never happen
            throw new waException(_w('Bad parameters'));
        }

        $start_ts = strtotime($start_date);
        $end_ts = strtotime($end_date);

        $join_tasks = false;
        $where_sql = [
            "tl.create_datetime >= '".date('Y-m-d H:i:s', $start_ts)."'",
            "tl.create_datetime <= '".date('Y-m-d H:i:s', $end_ts)."'"
        ];
        $tasks_where_sql = [];
        if (isset($filters['project_id'])) {
            $join_tasks = true;
            $where_sql[] = 't.project_id='.((int) $filters['project_id']);
            $tasks_where_sql[] = end($where_sql);
        }
        if (isset($filters['milestone_id'])) {
            $join_tasks = true;
            $where_sql[] = 't.milestone_id='.((int) $filters['milestone_id']);
            $tasks_where_sql[] = end($where_sql);
        }

        $join_tasks_sql = '';
        if ($join_tasks) {
            $join_tasks_sql = "JOIN tasks_task AS t ON t.id=tl.task_id";
        }

        $where_sql = join(' AND ', $where_sql);
        $sql = "SELECT tl.id, tl.task_id, tl.create_datetime, tl.before_status_id, tl.after_status_id, tl.assigned_contact_id
                FROM tasks_task_log AS tl
                $join_tasks_sql
                WHERE {$where_sql}
                ORDER BY tl.id";

        /*
         * Цикл проходит по всем строкам task_log в порядке возрастания create_datetime.
         * В переменной $current_day_tasks содержится состояние всех задач (которые попадались до сих пор)
         * на момент последней обработанной записи $log: статус задачи и назначенный юзер.
         * Как только очередная запись $log переходит на следующие сутки, на основании $current_day_tasks
         * создаётся запись в $all_days, в которой задачи подсчитываются по количеству для каждого статуса.
         */

        $empty_row = array_fill_keys(array_keys($statuses), 0);

        $all_days = [];
        $timestamps = [];
        $current_day_tasks = [];

        $current_day_ts = strtotime(substr($start_date, 0, 10));
        $next_day_ts = strtotime(date('Y-m-d H:i:s', $current_day_ts).' +1 day');

        $m = new waModel();
        foreach($m->query($sql) as $log) {
            $log_ts = strtotime($log['create_datetime']);
            if ($log_ts > $next_day_ts) {
                // Когда очередная запись переходит на новые сутки, создать новый столбец графика
                // используя данные в $current_day_tasks и положить в $all_days.
                $timestamps[] = [
                    'ts' => $current_day_ts,
                    'date' => date('d.m', $current_day_ts),
                ];
                $current_day_ts = $next_day_ts;
                $next_day_ts = strtotime(date('Y-m-d H:i:s', $current_day_ts).' +1 day');
                $all_days[] = self::makeOneDayRow($empty_row, $current_day_tasks, $filters);
            }

            if (isset($current_day_tasks[$log['task_id']])) {
                // Обновить состояние о задаче в $current_day_tasks используя данные в $log.
                $current_day_tasks[$log['task_id']]['status_id'] = $log['after_status_id'];
                $current_day_tasks[$log['task_id']]['assigned_contact_id'] = $log['assigned_contact_id'];
            } else {
                // Вставить инфу о задаче в $current_day_tasks, если задачу встретили в первый раз.
                $current_day_tasks[$log['task_id']] = [
                    'id' => $log['task_id'],
                    'status_id' => $log['after_status_id'],
                    'assigned_contact_id' => $log['assigned_contact_id'],
                ];

                if ($all_days) {
                    // Поскольку запись о задаче попалась в первый раз,
                    // все созданные дни до текущего в $all_days не учитывают эту задачу.
                    // Надо её туда добавить.
                    $should_update_all_days = true;

                    if ($log['before_status_id'] === null) {
                        // Задача только что создана. Не надо ничего обновлять за прошедшие дни.
                        $should_update_all_days = false;
                    }

                    if ($should_update_all_days && isset($filters['contact_id'])) {
                        // Если включен фильтр по назначенному юзеру, надо выяснить,
                        // на кого была назначена задача до текущего момента. В $log этой инфы нет.
                        $prev_assigned_contact_id = $m->query("
                            SELECT assigned_contact_id FROM tasks_task_log
                            WHERE task_id = ?
                                AND id < ?
                            ORDER BY id DESC LIMIT 1
                            ", [$log['task_id'], $log['id']]
                        )->fetchField();
                        if ($prev_assigned_contact_id != $filters['contact_id']) {
                            $should_update_all_days = false;
                        }
                    }

                    if ($should_update_all_days) {
                        foreach($all_days as &$d) {
                            $d[$log['before_status_id']] = 1 + ifset($d, $log['before_status_id'], 0);
                        }
                        unset($d);
                    }

                }
            }
        }
        $all_days[] = self::makeOneDayRow($empty_row, $current_day_tasks, $filters);
        $timestamps[] = [
            'ts' => $current_day_ts,
            'date' => date('d.m', $current_day_ts),
        ];

        // Если выбран фильтр по сроку и/или по контакту, то добавить в список даже те задачи, по которым не было действий
        if (isset($filters['milestone_id']) || isset($filters['project_id'])) {
            $tasks_where_sql[] = '1 = 1';
            $tasks_where_sql = join(' AND ', $tasks_where_sql);
            $sql = "SELECT t.id, t.status_id, t.assigned_contact_id
                    FROM tasks_task AS t
                    WHERE {$tasks_where_sql}";
            foreach($m->query($sql) as $task) {
                if (!isset($current_day_tasks[$task['id']])) {
                    $current_day_tasks[$task['id']] = $task;
                    foreach($all_days as &$d) {
                        $d[$task['status_id']] = 1 + ifset($d, $task['status_id'], 0);
                    }
                    unset($d);
                }
            }

        }

        return [$all_days, $timestamps];
    }

    protected static function makeOneDayRow($new_row, $current_day_tasks, $filters)
    {
        foreach($current_day_tasks as $t) {
            if (isset($filters['contact_id']) && $filters['contact_id'] != $t['assigned_contact_id']) {
                // Если включен фильтр по назначенному юзеру, то учитывать только задачи,
                // которые назначены на выбранного юзера на момент окончания дня
                continue;
            }
            $new_row[$t['status_id']]++;
        }
        return $new_row;
    }


    protected static function getFilters()
    {
        $result = [
            'project_id' => waRequest::request('project_id', null, 'int'),
            'contact_id' => waRequest::request('contact_id', null, 'int'),
            'milestone_id' => waRequest::request('milestone_id', null, 'int'),
        ];
        return array_filter($result, wa_lambda('$a', 'return !is_null($a);'));
    }
}
