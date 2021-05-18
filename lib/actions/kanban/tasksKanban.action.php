<?php

/**
 * Inherit from TasksAction to reuse ::getNextPageUrl() and ::get*FilterType().
 */
class tasksKanbanAction extends tasksTasksAction
{
    public function execute()
    {
        $offset = waRequest::get('offset', 0, waRequest::TYPE_INT);
        $limit = wa('tasks')->getConfig()->getOption('tasks_per_kanban');

        $filters = $this->getFilters();
        $statuses = $this->getStatusesForFilters($filters);

        $filterTypes = $this->getLogFilterTypes();

        $kanbanService = new tasksKanbanService();

        $kanban = [];
        foreach ($statuses as $status) {
            $kanbanRequest = new tasksKanbanRequestDto(
                $filters,
                $status,
                $filterTypes,
                $offset,
                $limit
            );

            $kanban[] = $kanbanService->getTasksForStatus($kanbanRequest) + ['status' => $status];
        }

        if (!empty($filters['tag'])) {
            $tag = (new tasksTagModel())->getByField('name',$filters['tag']);
            if ($tag) {
                $this->view->assign('tag', $tag);
            }
        }

        $this->view->assign(
            [
                'filter_types' => $filterTypes,
                'click_to_load_more' => $offset > 100,
                'is_filter_set' => !!$filters,
                'kanban' => $kanban,
                'tags_cloud' => self::getTagsCloud(),
            ]
        );
    }

    protected function getLogFilterTypes(): array
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

        return $result;
    }

    protected function getFilters(): array
    {
        $filters = [
            'project_id' => waRequest::request('project_id', null, waRequest::TYPE_INT),
            'contact_id' => waRequest::request('contact_id', null, waRequest::TYPE_INT),
            'milestone_id' => waRequest::request('milestone_id', null, waRequest::TYPE_INT),
            'tag' => waRequest::request('tag', null, waRequest::TYPE_STRING_TRIM),
            'with_backlog' => waRequest::request('with_backlog', null, waRequest::TYPE_INT),
        ];

        if ($filters['project_id'] === 0) {
            $filters['project_id'] = null;
        }

        return $filters;
    }

    protected function getStatusesForFilters(array $filters): array
    {
        switch (true) {
            case !empty($filters['project_id']):
                $statuses = tasksHelper::getStatuses($filters['project_id'], false);
                break;

            case !empty($filters['milestone_id']):
                /** @var tasksMilestone $milestone */
                $milestone = tsks()->getEntityRepository(tasksMilestone::class)->findById($filters['milestone_id']);
                if (!$milestone) {
                    throw new tasksException('No such milestone');
                }

                $statuses = tasksHelper::getStatuses($milestone->getProjectId());
                break;

            default:
                $statuses = tasksHelper::getStatuses(null, true);
        }

        if (!empty($filters['with_backlog'])) {
            array_unshift(
                $statuses,
                [
                    'id' => -1312,
                    'name' => _w('Backlog'),
                    'button' => '',
                    'action_name' => '',
                    'special' => 1,
                    'icon' => '',
                    'sort' => '',
                    'params' => [],
                    'icon_url' => false,
                    'icon_class' => '',
                    'icon_html' => '',
                ]
            );
        }

        return $statuses;
    }
}
