<?php
class tasksTasksPriorityController extends waJsonController
{
    public function execute()
    {
        $task_id = waRequest::request('task_id', 0, 'int');
        $priority = waRequest::post('priority', null, 'int');
        if (!$task_id || $priority === null) {
            return;
        }

        $task_model = new tasksTaskModel();
        $task_model->updateById($task_id, array(
            'priority' => $priority,
        ));
    }
}
