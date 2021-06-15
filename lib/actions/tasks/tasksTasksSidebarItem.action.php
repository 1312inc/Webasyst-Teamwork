<?php

class tasksTasksSidebarItemAction extends tasksTasksAction
{
    public function execute()
    {
        $id = waRequest::get('id', null, waRequest::TYPE_INT);
        $uuid = waRequest::get('uuid', null, waRequest::TYPE_STRING_TRIM);

        if ($id) {
            $c = new tasksCollection(sprintf('%s/%d', tasksCollection::HASH_ID, $id));
        } elseif ($uuid) {
            $c = new tasksCollection(sprintf('%s/%s', tasksCollection::HASH_UUID, $uuid));
        }

        $task_rows = $c->getTasks(tasksCollection::FIELDS_TO_GET);

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

        $this->view->assign(['task' => reset($tasks)]);
    }
}
