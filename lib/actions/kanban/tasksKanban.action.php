<?php

/**
 * Inherit from TasksAction to reuse ::getNextPageUrl() and ::get*FilterType().
 */
class tasksKanbanAction extends tasksLogAction
{
    public function execute()
    {
        $offset = waRequest::get('offset', 0, waRequest::TYPE_INT);
        $limit = tasksOptions::getTasksPerPage();

        $filters = $this->getFilters();
        $statuses = $this->getStatusesForFilters($filters);

        $filterTypes = $this->getLogFilterTypes();

        $kanbanService = new tasksKanbanService();

        $kanban = [];
        foreach ($statuses as $status) {
            $withUnassigned = (bool) waRequest::request('with_backlog', null);
            $order = tasksKanbanRequestDto::ORDER_PRIORITY;
            if ($status['id'] == tasksStatusModel::STATUS_CLOSED_ID) {
                $withUnassigned = true;
                $order = tasksKanbanRequestDto::ORDER_NEWEST;
            }

            $kanbanRequest = new tasksKanbanRequestDto(
                $filters,
                $status,
                $filterTypes,
                $withUnassigned,
                $offset,
                $limit,
                $order
            );

            $statusData = $kanbanService->getTasksForStatus($kanbanRequest) + ['status' => $status];
            tasksHelper::workupTasksForView($statusData['tasks']);
            $kanban[] = $this->kanbanStatusTasks($statusData);
        }

        if (!empty($filters['tag'])) {
            $tag = (new tasksTagModel())->getByField('name', $filters['tag']);
            if ($tag) {
                $this->view->assign('tag', $tag);
            }
        }

        // hook jukebox
        $this->triggerKanbanTasksEvent(
            $kanban,
            [
                'filters' => $filters,
            ]
        );

        /**
         * UI hook for extend task kanban page:
         *
         * extend other page blocks, like filters block in header of page
         *
         *
         * @event kanban_tasks
         *
         * @param int[]|array[]|tasksTask[] $kanban
         * @param string                    $hash
         * @param string                    $filters
         * @param string                    $order
         *
         * Returns complex structure
         *
         * In keys returns html blocks for whole tasks page
         *
         * @return array $return[%plugin_id%]['header'] html blocks in header of page
         *
         * @return string $return[%plugin_id%]['header']['filters'] array of html blocks, each is filter html block
         */
        $kanbanTasksResult = wa()->event(tasksEventsStorage::KANBAN_PAGE, $params);
        $pageHooks = [];
        foreach ($kanbanTasksResult as $pluginId => $kanbanTasks) {
            foreach ($kanbanTasks as $key => $result) {
                $pageHooks[$key][$pluginId] = $result;
            }
        }

        $isFilterSet = count(array_filter($filters));

        $this->view->assign([
            'kanban_page_hooks'  => $pageHooks,
            'filter_types'       => $filterTypes,
            'click_to_load_more' => $offset > 100,
            'is_filter_set'      => $isFilterSet,
            'kanban'             => $kanban,
            'tags_cloud'         => self::getTagsCloud(),
            'hide_filter_html'   => $this->getHideFilterHtml()
        ]);
    }

    protected function getFilters(): array
    {
        $filters = [
            'project_id' => waRequest::request('project_id', null),
            'assigned_contact_id' => waRequest::request('contact_id', null),
            'milestone_id' => waRequest::request('milestone_id', null),
            'tag' => waRequest::request('tag', null, waRequest::TYPE_STRING_TRIM),
        ];

        foreach ($filters as &$filter) {
            if ($filter === '') {
                $filter = null;
            }
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

        return $statuses;
    }


    /**
     * Trigger 'kanban_tasks' event
     * See doc comments in method body
     *
     * @param $kanban
     * @param $params
     */
    protected function triggerKanbanTasksEvent(&$kanban, $params)
    {
        /**
         * UI hook for extend task kanban page:
         *
         * extend each task html block as like as in 'kanban_task' event
         *
         *
         * @event kanban_tasks
         *
         * @param int[]|array[]|tasksTask[] $kanban
         * @param string                    $hash
         * @param string                    $filters
         * @param string                    $order
         *
         * Returns complex structure
         *
         * In key 'tasks' returns html blocks for each tasks
         *
         * @return array[string]array $return[%plugin_id%][%task_id%] array of array of html output
         *
         * @return string $return[%plugin_id%][%task_id%]['after_body'] html
         */
        $params['tasks'] = $kanban;

        $kanbanTasksResult = wa()->event(tasksEventsStorage::KANBAN_STATUS_TASKS, $params);

        foreach ($kanban as $data) {
            foreach ($data['tasks'] as &$task) {
                $hooks = [
                    tasksEventsStorage::KANBAN_STATUS_TASKS => [],
                ];
                foreach ($kanbanTasksResult as $pluginId => $kanbanTasks) {
                    $hooks[tasksEventsStorage::KANBAN_STATUS_TASKS][$pluginId] = [];
                    if (isset($kanbanTasks[$task['id']])) {
                        $hooks[tasksEventsStorage::KANBAN_STATUS_TASKS][$pluginId] = $kanbanTasks[$task['id']];
                    }
                }
                $task['hooks'] = $hooks;
            }
        }
        unset($task);
    }

    protected function getHideFilterHtml()
    {
        $limits = 10;
        $milestone_id = waRequest::get('milestone_id', 0, waRequest::TYPE_INT);
        if ($milestone_id) {
            $tasks_milestone_ext_model = new tasksMilestoneExtModel();
            $limits = json_encode($tasks_milestone_ext_model->where('milestone_id = ?', $milestone_id)->fetchAll('status_id'));
        }

        $view = wa()->getView();
        $view->assign([
            'limits'        => $limits,
            'milestone_id'  => $milestone_id,
            'is_hide_tasks' => (bool) wa()->getUser()->getSettings('tasks', 'hide_new_and_completed_tasks', false)
        ]);

        return $view->fetch(wa()->getAppPath('templates/actions/kanban/KanbanHideFilter.inc.html', 'tasks'));
    }

    public function kanbanStatusTasks($status_data)
    {
        $task_ids = [];
        $kanban_colors = [];
        $view = wa()->getView();

        /** @var tasksTask $task */
        foreach ($status_data['tasks'] as $task) {
            $task_ids[] = (int) $task->id;
        }

        if ($task_ids) {
            $tasks_ext_model = new tasksTaskExtModel();
            $kanban_colors = $tasks_ext_model->select('task_id, kanban_color')
                ->where('task_id IN (i:ids)', ['ids' => $task_ids])
                ->fetchAll('task_id');
        }

        /** @var tasksTask $task **/
        foreach ($status_data['tasks'] as &$task) {
            $task_id = $task->id;
            $changed_time = null;
            $date_difference = 0;
            foreach ($task->getLog() as $log) {
                if (
                    $log['project_id'] == $task->project_id
                    && $log['before_status_id'] != $log['after_status_id']
                    && ($log['before_status_id'] == null || $log['before_status_id'] == $task->status_id || $log['after_status_id'] == $task->status_id)
                ) {
                    if ($log['after_status_id'] == $task->status_id) {
                        $changed_time = strtotime($log['create_datetime']);
                    } elseif ($changed_time && $log['before_status_id'] == $task->status_id) {
                        $date_difference += strtotime($log['create_datetime']) - $changed_time;
                        $changed_time = null;
                    }
                }
            }

            if ($changed_time) {
                $date_difference += time() - $changed_time;
            }
            $days_difference = floor(($date_difference) / 3600 / 24);
            $task_color = ifset($kanban_colors, $task_id, 'kanban_color', '');

            $view->clearAllAssign();
            $view->assign([
                'task_id'         => $task_id,
                'task_color'      => $task_color,
                'days_difference' => $days_difference
            ]);
            $task['status_html'] = $view->fetch(wa()->getAppPath('templates/actions/kanban/KanbanSettings.inc.html', 'tasks'));
        }

        return $status_data;
    }
}
