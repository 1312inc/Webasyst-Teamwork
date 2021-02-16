<?php
/**
 * History of actions with all requests.
 * Inherit from TasksAction to reuse ::getNextPageUrl() and ::get*FilterType().
 */
class tasksLogAction extends tasksTasksAction
{
    public function execute()
    {
        $offset = waRequest::get('offset', 0, 'int');
        $limit = wa('tasks')->getConfig()->getOption('logs_per_page');

        // List of logs
        $filters = self::getFilters();
        $task_log_model = new tasksTaskLogModel();
        $logs = $task_log_model->getList(array(
            'start' => $offset,
            'limit' => $limit,
            'tasks' => true
        ) + $filters, $total_count);
        self::pluginHook($logs);
        self::addStatusColors($logs);
        $count = count($logs);

        // Lazy-loading setup
        $next_page_url = self::getNextPageUrl($offset, $limit, $count, $total_count);
        if ($next_page_url) {
            $next_page_url .= '&lazy=1';
        }

        // Chart is rendered using a separate action
        $chart_html = '';
        if (!waRequest::request('lazy') && $logs) {
            $chart_action = new tasksLogChartAction();
            $chart_html = $chart_action->display();
        }

        $this->view->assign(array(
            'count' => $count,
            'offset' => $offset,
            'total_count' => $total_count,
            'filter_types' => self::getLogFilterTypes(),
            'click_to_load_more' => $offset > 100,
            'next_page_url' => $next_page_url,
            'is_filter_set' => !!$filters,
            'chart_html' => $chart_html,
            'logs' => $logs,
        ));
    }

    protected static function getLogFilterTypes()
    {
        $project_id = waRequest::request('project_id', null, 'int');
        return array(
            'project_id' => self::getProjectFilterType(),
            'milestone_id' => self::getMilestoneFilterType(),
            'contact_id' => self::getUsersFilterType($project_id),
        );
    }

    protected static function getMilestoneFilterType()
    {
        $result = parent::getMilestoneFilterType();
        $result['0']['id'] = '0';
        return $result;
    }

    protected static function getFilters()
    {
        $result = array(
            'project_id' => waRequest::request('project_id', null, 'int'),
            'contact_id' => waRequest::request('contact_id', null, 'int'),
            'milestone_id' => waRequest::request('milestone_id', null, 'int'),
        );
        return array_filter($result, wa_lambda('$a', 'return !is_null($a);'));
    }

    protected static function addStatusColors(&$logs)
    {
        $statuses = tasksHelper::getStatuses(null, false);

        // Prepare status info for JS
        foreach($statuses as $sid => &$s) {
            if(!empty($s['params']['button_color'])) {
                $color = '#'.$s['params']['button_color'];
            } else if ($s['id'] == -1) {
                $color = '#77dd77'; // `done`
            } else {
                $color = '#44aa44'; // `new`
            }
            $s['color'] = $color;
        }

        foreach($logs as &$l) {
            $l += array(
                'before_status_color' => 'transparent',
                'after_status_color' => 'transparent',
            );
            if (!empty($statuses[$l['before_status_id']])) {
                $l['before_status_color'] = $statuses[$l['before_status_id']]['color'];
            }
            if (!empty($statuses[$l['after_status_id']])) {
                $l['after_status_color'] = $statuses[$l['after_status_id']]['color'];
            }
        }
    }

    protected static function pluginHook(&$logs)
    {
        $logs_by_task = array();
        foreach($logs as &$l) {
            $logs_by_task[$l['task_id']][$l['id']] =& $l;
        }
        unset($l);
        wa('tasks')->event('tasks_log', $logs_by_task);
    }
}
