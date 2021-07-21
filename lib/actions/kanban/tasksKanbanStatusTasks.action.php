<?php

class tasksKanbanStatusTasksAction extends tasksKanbanAction
{
    public function execute()
    {
        $offset = waRequest::get('offset', 0, waRequest::TYPE_INT);
        $limit = wa('tasks')->getConfig()->getOption('tasks_per_kanban');
        $statusId = waRequest::get('status_id', 0, waRequest::TYPE_INT);

        $filters = $this->getFilters();

//        if ($statusId === -1312) {
//            $status = [
//                'id' => -1312,
//                'name' => _w('Backlog'),
//                'button' => '',
//                'action_name' => '',
//                'special' => 1,
//                'icon' => '',
//                'sort' => '',
//                'params' => [],
//                'icon_url' => false,
//                'icon_class' => '',
//                'icon_html' => '',
//            ];
//        } else {
            $status = null;
            foreach ($this->getStatusesForFilters($filters) as $s) {
                if ($statusId == $s['id']) {
                    $status = $s;
                    break;
                }
            }
//        }

        if ($status === null) {
            throw new tasksException('No status found for this request');
        }

        $kanbanRequest = new tasksKanbanRequestDto(
            $filters,
            $status,
            $this->getLogFilterTypes(),
            (bool) waRequest::request('with_backlog', null),
            $offset,
            $limit
        );

        $kanban = (new tasksKanbanService())->getTasksForStatus($kanbanRequest);
        tasksHelper::workupTasksForView($kanban['tasks']);
        $eventKanban = [$kanban];

        // hook jukebox
        $this->triggerKanbanTasksEvent(
            $eventKanban,
            [
                'filters' => $filters,
            ]
        );

        $this->view->assign(['data' => $kanban]);
    }
}
