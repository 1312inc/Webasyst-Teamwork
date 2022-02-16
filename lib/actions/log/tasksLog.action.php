<?php

/**
 * History of actions with all requests.
 * Inherit from TasksAction to reuse ::getNextPageUrl() and ::get*FilterType().
 */
class tasksLogAction extends tasksTasksAction
{
    public function execute()
    {
        $request = new tasksApiLogGetListRequest(
            waRequest::request('project_id', null, 'int') ?: null,
            waRequest::request('contact_id', null, 'int') ?: null,
            waRequest::request('milestone_id', null, 'int') ?: null,
            (int) waRequest::get('offset', 0, 'int'),
            tasksOptions::getLogsPerPage()
        );

        $response = (new tasksApiLogGetListHandler())->getLogs($request);

        $isLazy = waRequest::request('lazy');

        // Lazy-loading setup
        $next_page_url = self::getNextPageUrl(
            $request->getOffset(),
            $request->getLimit(),
            $response->getCount(),
            $response->getTotal()
        );
        if (!$isLazy && $next_page_url) {
            $next_page_url .= '&lazy=1';
        }

        $logs = $response->getLogs();
        // Chart is rendered using a separate action
        $chartHtml = '';
        if (!$isLazy && $logs && wa()->getUser()->isAdmin(tasksConfig::APP_ID)) {
            $chart_action = new tasksLogChartAction();
            $chartHtml = $chart_action->display();
        }

        $this->view->assign(
            [
                'count' => $response->getCount(),
                'offset' => $request->getOffset(),
                'total_count' => $response->getTotal(),
                'filter_types' => self::getLogFilterTypes(),
                'click_to_load_more' => $request->getOffset() > 100,
                'next_page_url' => $next_page_url,
                'is_filter_set' => !empty($request->getFilters()),
                'chart_html' => $chartHtml,
                'logs' => $response->getLogs(),
                'groupedLogs' => $response->groupLogsByDates(),
                'isLazy' => $isLazy,
            ]
        );
    }

    protected static function getLogFilterTypes()
    {
        $project_id = waRequest::request('project_id', null, 'int');

        return [
            'project_id' => self::getProjectFilterType(),
            'milestone_id' => self::getMilestoneFilterType(),
            'contact_id' => self::getUsersFilterType($project_id),
        ];
    }

    protected static function getMilestoneFilterType(): array
    {
        $result = parent::getMilestoneFilterType();
        $result['0']['id'] = '0';

        $project_id = waRequest::request('project_id', null, 'int');
        $projects = (new tasksRights())->getAvailableProjectForContact(wa()->getUser());

        foreach ($result as $i => $milestone) {
            if ($project_id && !empty($milestone['project_id']) && $project_id != $milestone['project_id']) {
                unset($result[$i]);
            }

            if ($projects !== true
                && !empty($milestone['project_id'])
                && !in_array($milestone['project_id'], $projects[tasksRights::PROJECT_ANY_ACCESS])
            ) {
                unset($result[$i]);
            }
        }

        return $result;
    }
}
