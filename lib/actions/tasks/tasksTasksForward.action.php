<?php
/**
 * Form for "forward" action. Used both for a single task, and for multiple tasks in a dialog.
 */
class tasksTasksForwardAction extends waViewAction
{
    public function execute()
    {
        $id = waRequest::request('id', 0, 'int');
        $teamGetter = new tasksTeamGetter();
        if ($id) {
            $task = new tasksTask($id);
            if (!$task->exists()) {
                throw new waException(_w('Task not found'), 404);
            }

            $this->view->assign(array(
                'users' => $teamGetter->getTeam(new taskTeamGetterParamsDto($task['project_id'], false, false, true)),
                'statuses' => tasksHelper::getStatuses($task['project_id']),
                'form_url' => '?module=tasksLog&action=forward&id='.$task['id'],
                'selected_user' => $task['assigned_contact_id'],
                'selected_status_id' => $task['status_id'],
                'is_bulk' => false,
                'task_uuid' => $task['uuid'],
                'task' => $task,
            ));
        } else {
            $this->view->assign(array(
                'projects' => tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray(),
                'users' => $teamGetter->getTeam(new taskTeamGetterParamsDto(null, false, false, true)),
                'statuses' => tasksHelper::getStatuses(),
                'form_url' => '?module=tasksBulk&action=forward',
                'selected_status_id' => null,
                'selected_user' => null,
                'is_bulk' => true,
            ));
        }
    }
}

