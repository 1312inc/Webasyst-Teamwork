<?php

class tasksReleasesPluginTaskInBugsController extends waJsonController
{
    public function execute()
    {
        $task_id = waRequest::post('task_id', null, waRequest::TYPE_INT);

        $task_model = new tasksTaskModel();
        $task = $task_model->getById($task_id);
        if ($task) {
            $new_status = 3;
            $new_milestone = 53;
            $assigned_contact_id = null;

            $task_model->updateById($task_id, [
                'milestone_id' => $new_milestone,
                'status_id' => $new_status,
                'assigned_contact_id' => $assigned_contact_id
            ]);

            $log = tasksHelper::addLog($task, array(
                'action'              => tasksTaskLogModel::ACTION_TYPE_EDIT,
                'milestone_id'        => $new_milestone,
                'status_id'           => $new_status,
                'assigned_contact_id' => $assigned_contact_id,
            ));

            $this->logAction('task_edit', $log['task_id'].':'.$log['id']);
            $this->response = array(
                'id' => $log['id'],
            );
        }
    }
}