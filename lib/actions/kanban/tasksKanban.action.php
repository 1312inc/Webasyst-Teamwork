<?php

/**
 * Inherit from TasksAction to reuse ::getNextPageUrl() and ::get*FilterType().
 */
class tasksKanbanAction extends tasksTasksAction
{
    public function execute()
    {
        $offset = waRequest::get('offset', 0, 'int');
        $limit = wa('tasks')->getConfig()->getOption('tasks_per_kanban');
        $withBacklog = waRequest::get('with_backlog', 0, waRequest::TYPE_INT);

        $filters = self::getFilters();

        switch (true) {
            case !empty($filters['project_id']):
                $statuses = tasksHelper::getStatuses($filters['project_id'], false);
                break;

            case !empty($filters['milestone_id']):
                $statuses = (new tasksMilestoneModel())->getMilestoneStatuses($filters['milestone_id']);
                break;

            default:
                $statuses = tasksHelper::getStatuses(null, true);
        }
        $filterTypes = self::getLogFilterTypes();

        $kanban = [];
        foreach ($statuses as $status) {
            $c = new tasksCollection('search');

            $this->applyFilters($c, $filters + ['status_id' => $status['id']]);
            $this->applyOrder($c, 'priority');

            $totalCount = null;
            $taskRows = $c->getTasks(
                '*,log,create_contact,assigned_contact,attachments,tags,project,favorite,relations',
                $offset,
                $limit,
                $totalCount
            );

            $tasks = [];
            foreach ($taskRows as $t) {
                $tasks[$t['id']] = new tasksTask($t);
            }
            unset($taskRows);

            $kanban[$status['id']] = [
                'status' => $status,
                'count' => $totalCount,
                'tasks' => $tasks,
            ];
        }

        // Lazy-loading setup
//        $nextPageUrl = self::getNextPageUrl($offset, $limit, $count, $total_count);
//        if ($nextPageUrl) {
//            $nextPageUrl .= '&lazy=1';
//        }

        $this->view->assign(
            [
                'filter_types' => $filterTypes,
                'click_to_load_more' => $offset > 100,
//                'next_page_url' => $nextPageUrl,
                'is_filter_set' => !!$filters,
                'kanban' => $kanban,
                'tags_cloud' => self::getTagsCloud(),
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

    protected static function getMilestoneFilterType()
    {
        $result = parent::getMilestoneFilterType();
        $result['0']['id'] = '0';

        return $result;
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
