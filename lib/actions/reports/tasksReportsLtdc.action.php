<?php
/**
 * Частотная диаграмма - время выполнения задач.
 */
class tasksReportsLtdcAction extends tasksLogAction
{
    public function execute()
    {
        if (wa()->whichUI('tasks') != '2.0') {
            throw new waException(_w('Reports are available in the Webasyst 2 interface only.'));
        }

        // Get parameters from GET/POST
        $filters = self::getFilters();
        list($start_date, $end_date, $group_by) = tasksLogChartAction::getTimeframeParams();

        $chart_data = self::getChartData($filters, $start_date, $end_date, $group_by);

        $this->view->assign([
            'filter_types' => self::getLogFilterTypes(),
            'filters'      => $filters,
            'start_date'   => $start_date,
            'end_date'     => $end_date,
            'chart_data'   => $chart_data,
            'group_by'     => $group_by,
        ]);
    }

    protected static function getChartData($filters, $start_date, $end_date, $group_by)
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
        if (isset($filters['project_id'])) {
            $join_tasks = true;
            $where_sql[] = 't.project_id='.((int) $filters['project_id']);
        }
        if (isset($filters['milestone_id'])) {
            $join_tasks = true;
            $where_sql[] = 't.milestone_id='.((int) $filters['milestone_id']);
        }
        if (isset($filters['contact_id'])) {
            // Фильтр по контакту - это просто задачи, с которыми контакт совершал хотя бы одно действие за период.
            // Дальше как обычно: время от первого принятия в работу до последнего завершения задачи.
            // Без попыток выяснить, сколько времени задача висела на этом конкретном контакте.
            $where_sql[] = 'tl.assigned_contact_id='.((int) $filters['contact_id']);
        }

        $m = new waModel();
        $ext_join_sql = '';
        if (isset($filters['task_type'])) {
            $ext_join_sql = 'JOIN tasks_releases_task_ext AS te ON te.task_id=tl.task_id';
            $where_sql[] = "te.type='".$m->escape($filters['task_type'])."'";
        }

        $join_tasks_sql = '';
        if ($join_tasks) {
            $join_tasks_sql = "JOIN tasks_task AS t ON t.id=tl.task_id";
        }

        // Узнать, какие задачи попадают в выбранный фильтр и выбранный период
        $where_sql = join(' AND ', $where_sql);
        $sql = "SELECT DISTINCT tl.task_id
                FROM tasks_task_log AS tl
                $join_tasks_sql
                $ext_join_sql
                WHERE {$where_sql}
                ORDER BY task_id";

        $task_ids = array_keys($m->query($sql)->fetchAll('task_id'));

        $result_groups = [];

        // Грузить из базы и обрабатывать историю задач пачками по 50 задач.
        $sql = "SELECT id, task_id, DATE(create_datetime) AS `date`, before_status_id, after_status_id, assigned_contact_id
                FROM tasks_task_log AS tl
                WHERE task_id IN (?)
                ORDER BY task_id";
        $statuses = tasksHelper::getStatuses(null, false);
        $statuses_keys = array_keys($statuses);
        $open_key = array_search($filters['start_status'], $statuses_keys);
        $open_statuses = $open_key !== false ?
            array_slice($statuses_keys, $open_key, null) : array_slice($statuses_keys, array_search(0, $statuses_keys), null);
        $closed_key = array_search($filters['end_status'], $statuses_keys);
        if ($closed_key !== false) {
            $reopen_statuses = array_slice($statuses_keys, 0, $closed_key);
            $closed_statuses = array_slice($statuses_keys, $closed_key, null);
        } else {
            $reopen_statuses = array_filter($statuses_keys, function ($v) { return $v >= 0; });
            $closed_statuses = [-1];
        }
        while ($task_ids) {
            $batch = array_splice($task_ids, 0, 50);
            $current_task_id = null;
            $task_start_datetime = null;
            $task_end_datetime = null;
            foreach($m->query($sql, [$batch]) as $log) {
                if ($current_task_id !== $log['task_id']) {
                    if ($current_task_id) {
                        // Задачи, не взятые в работу или не завершённые, не учитываются в статистике
                        if ($task_start_datetime && $task_end_datetime) {
                            $result_groups[self::countDays($task_start_datetime, $task_end_datetime)][] = $current_task_id;
                        }
                    }
                    $current_task_id = $log['task_id'];
                    $task_start_datetime = null;
                    $task_end_datetime = null;
                }
                if (!$task_start_datetime && in_array($log['after_status_id'], $open_statuses)) {
                    // Задача взята в работу
                    $task_start_datetime = $log['date'];
                }
                if ($task_end_datetime && in_array($log['after_status_id'], $reopen_statuses)) {
                    // Задача переоткрыта
                    $task_end_datetime = null;
                }
                if (!$task_end_datetime && in_array($log['after_status_id'], $closed_statuses)) {
                    // Задача закрыта
                    $task_end_datetime = $log['date'];
                }
            }
            if ($current_task_id && $task_start_datetime && $task_end_datetime) {
                $result_groups[self::countDays($task_start_datetime, $task_end_datetime)][] = $current_task_id;
                $current_task_id = null;
            }
        }

        ksort($result_groups);

        return $result_groups;
    }

    protected static function countDays($start, $end)
    {
        $start = new DateTime($start);
        $end = new DateTime($end);
        return $start->diff($end)->format("%r%a");
    }

    protected static function getFilters()
    {
        $result = [
            'project_id'   => waRequest::request('project_id', null, 'int'),
            'contact_id'   => waRequest::request('contact_id', null, 'int'),
            'milestone_id' => waRequest::request('milestone_id', null, 'int'),
            'task_type'    => waRequest::request('task_type'),
            'start_status' => waRequest::request('start_status', 0, 'int'),
            'end_status'   => waRequest::request('end_status', -1, 'int'),
        ];

        if (!in_array($result['task_type'], ['sr', 'dev', 'bug'])) {
            unset($result['task_type']);
        }

        return array_filter($result, wa_lambda('$a', 'return !is_null($a);'));
    }

    protected static function getLogFilterTypes()
    {
        $result = parent::getLogFilterTypes();

        $result['task_type'] = [
            '' => [
                'id' => '',
                'name' => _w('All task types'),
            ],
            'sr' => [
                'id' => 'sr',
                'name' => 'SR',
            ],
            'dev' => [
                'id' => 'dev',
                'name' => 'Dev',
            ],
            'bug' => [
                'id' => 'bug',
                'name' => 'Bug',
            ],
        ];

        return $result;
    }
}
