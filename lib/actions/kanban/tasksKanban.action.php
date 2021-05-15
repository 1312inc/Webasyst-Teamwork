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
        $withBacklog = waRequest::get('with_backlog', 0, waRequest::TYPE_INT);

        $filters = $this->getFilters();
        $statuses = $this->getStatusesForFilters($filters);

        if ($withBacklog) {
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

        $filterTypes = $this->getLogFilterTypes();

        $kanbanService = new tasksKanbanService();

        $kanban = [];
        foreach ($statuses as $status) {
            $kanbanRequest = new tasksKanbanRequestDto(
                $filters['project_id'] ?? null,
                $filters['contact_id'] ?? null,
                $filters['milestone_id'] ?? null,
                $status,
                $filterTypes,
                $offset,
                $limit
            );

            $kanban[] = $kanbanService->getTasksForStatus($kanbanRequest) + ['status' => $status];
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
        $result = [
            'project_id' => waRequest::request('project_id', null, 'int'),
            'contact_id' => waRequest::request('contact_id', null, 'int'),
            'milestone_id' => waRequest::request('milestone_id', null, 'int'),
        ];

        return array_filter($result, wa_lambda('$a', 'return !is_null($a);'));
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

        return $statuses;
    }
}
