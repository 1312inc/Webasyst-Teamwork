<?php

class tasksTasksStatusformAction extends waViewAction
{
    public function execute()
    {
        $id = waRequest::request('id', 0, 'int');
        $task = new tasksTask($id);
        if (!$task->exists()) {
            throw new waException(_w('Task not found'), 404);
        }

        $next_status = $task['next_status'];
        $status_id = waRequest::request('status_id', null, 'int');

        if ($next_status) {
            if ($status_id === null || $next_status['id'] != $status_id) {
                $next_status = null;
            }
        }
        if (!$next_status) {
            throw new waException('Status id changed', 400);
        }

        /**
         * @event show_status_form
         * For developer. Subject to change
         */
        $params = array(
            'task'        => $task,
            'next_status' => $next_status,
            'status_id'   => $status_id,
        );

        $custom_html = wa('tasks')->event('show_status_form', $params);

        $this->view->assign(array(
            'next_status' => $next_status,
            'task'        => $task,
            'custom_html' => $custom_html,
        ));
    }
}

