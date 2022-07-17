<?php

class tasksFrontendAction extends waViewAction
{
    public function execute()
    {
        $publicHash = waRequest::param('public_hash', '', waRequest::TYPE_STRING_TRIM);
        if (!$publicHash) {
            throw new waException('Not found', 404);
        }

        $collection = new tasksCollection(sprintf('%s/%s', tasksCollection::HASH_PUBLIC_HASH, $publicHash));
        $taskRows = $collection->getTasks(tasksCollection::FIELDS_TO_GET, 0, 1);

        $tasks = [];
        $logsByTask = [];
        foreach ($taskRows as $t) {
            $tasks[$t['id']] = new tasksTask($t);
            if (!empty($t['log'])) {
                $logsByTask[$t['id']] = $t['log'];
            }
        }
        unset($taskRows);

        wa('tasks')->event('tasks_log', $logsByTask);
        foreach ($logsByTask as $taskId => $log) {
            $tasks[$taskId]['log'] = $log;
        }
        unset($logsByTask);

        // prepare tasks for view
        tasksHelper::workupTasksForView($tasks);

        $this->setTemplate(wa()->getAppPath('templates/frontend/public_task.html'));
        $this->view->assign(['task' => reset($tasks)]);
    }
}
