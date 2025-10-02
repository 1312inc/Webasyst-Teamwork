<?php

class tasksFrontendTaskPublicAction extends waViewAction
{
    public function execute()
    {
        $public_hash = waRequest::param('public_hash', '', waRequest::TYPE_STRING_TRIM);
        if (!$public_hash) {
            wa()->getResponse()->setStatus(404);
            $this->setTemplate(wa()->getAppPath('templates/frontend/public_task_error.html'));

            return;
        }

        $collection = new tasksCollection(sprintf('%s/%s', tasksCollection::HASH_PUBLIC_HASH, $public_hash), ['check_rights' => false]);
        $task_rows = $collection->getTasks(tasksCollection::FIELDS_TO_GET, 0, 1);

        if (empty($task_rows)) {
            wa()->getResponse()->setStatus(404);
            $this->setTemplate(wa()->getAppPath('templates/frontend/public_task_error.html'));

            return;
        }

        $tasks = [];
        $logs_by_task = [];
        foreach ($task_rows as $t) {
            $tasks[$t['id']] = new tasksTask($t);
            if (!empty($t['log'])) {
                $logs_by_task[$t['id']] = $t['log'];
            }
        }
        unset($task_rows);

        wa('tasks')->event('tasks_log', $logs_by_task);
        foreach ($logs_by_task as $task_id => $log) {
            $tasks[$task_id]['log'] = $log;
        }
        unset($logs_by_task);

        // prepare tasks for view
        tasksHelper::workupTasksForView($tasks);

        $this->setTemplate(wa()->getAppPath('templates/frontend/public_task.html'));
        $this->view->assign(['task' => reset($tasks)]);
    }
}
