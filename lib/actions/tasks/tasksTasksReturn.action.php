<?php

class tasksTasksReturnAction extends waViewAction
{
    public function execute()
    {
        $id = waRequest::request('id', 0, 'int');
        $task = new tasksTask($id);
        if (!$task->exists()) {
            throw new waException(_w('Task not found'), 404);
        }
        if (!$task['return_actor']['id']) {
            throw new waException(
                _w('Unable to return task because contact has been deleted. Use forward action instead.'), 404
            );
        }
        $this->view->assign('task', $task);
    }
}

