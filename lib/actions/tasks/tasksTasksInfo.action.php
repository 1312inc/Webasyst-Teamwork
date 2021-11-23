<?php

/**
 * Single task page.
 */
class tasksTasksInfoAction extends waViewAction
{
    public function execute()
    {
        $n = waRequest::get('n');
        $id = waRequest::get('id', 0, 'int');

        $task = new tasksTask(ifempty($id, $n));
        $tasks_tags_model = new tasksTaskTagsModel();

        if (!$task->exists()) {

            //May be task moved. Need check this.
            $task_log_params_model = new tasksTaskLogParamsModel();
            $log = $task_log_params_model->getByField(array(
                    'name'  => 'prev.project.number',
                    'value' => $n
                )
            );

            //If moved reinitialize task class
            if (!empty($log['task_id'])) {
                $task = new tasksTask($log['task_id']);
            }
        }

        if (!$task->exists()) {
            throw new waException(_w('Task not found'), 404);
        }

        if (!$task->canView($this->getUserId(), true)) {
            throw new waRightsException(_w('You do not have sufficient access rights to view this task.'));
        }

        $this->workup($task);

        $log = $task['log'];
        if ($log) {
            $task['log'] = $log;
            $last_log = end($log);
            if (($last_log['before_status_id'] != $last_log['after_status_id']) || $last_log['assigned_contact_id']) {
                if ($last_log['text']) {
                    $this->view->assign('last_log', $last_log);
                }
            }
        }

        $milestones = (new tasksMilestoneModel())->getMilestonesWithOrder(false);

        foreach ($milestones as $id => $milestone) {
            if ($milestone['project_id'] != $task->project_id) {
                unset($milestones[$id]);
            }
        }

        $this->view->assign('tags_cloud', $tasks_tags_model->getCloud($task->project_id));
        $this->view->assign('statuses', tasksHelper::getStatuses());
        $this->view->assign('task', $task);
        $this->view->assign('taskAssignedContactStatus', (new tasksTeammateStatusService())->getForContactId($task->assigned_contact_id, new DateTimeImmutable()));

        $this->view->assign('hash_type', waRequest::get('from_hash_type', '', waRequest::TYPE_STRING_TRIM));

        $this->view->assign('milestones', $milestones);
    }

    public function workup(&$task)
    {
        $tasks = array($task['id'] => $task);
        tasksHelper::workupTasksForView($tasks);
        $task = $tasks[$task['id']];
        $this->triggerEvent($task);
    }

    /**
     * @param $task
     */
    public function triggerEvent(&$task)
    {
        /**
         * UI hook for extend task html page in single task page
         * Plugin must return array of html peaces indexed by string key
         * Each key represents location where corresponding html peace will be placed
         *
         * @event backend_task
         * @param int|array|tasksTask $task
         * @return array[string]array $return[%plugin_id%] array of html output
         *
         * @return string $return[%plugin_id%]['before_header'] html
         * @return string $return[%plugin_id%]['header'] html
         * @return string $return[%plugin_id%]['after_header'] html
         *
         * @return string $return[%plugin_id%]['before_description'] html
         * @return string $return[%plugin_id%]['description'] html
         * @return string $return[%plugin_id%]['after_description'] html
         *
         * @return string $return[%plugin_id%]['before_attachments'] html
         * @return string $return[%plugin_id%]['attachments'] html
         * @return string $return[%plugin_id%]['after_attachments'] html
         *
         * @return string $return[%plugin_id%]['before_quote_header'] html
         * @return string $return[%plugin_id%]['quote_header'] html
         * @return string $return[%plugin_id%]['after_quote_attachments'] html
         *
         * @return string $return[%plugin_id%]['before_quote_description'] html
         * @return string $return[%plugin_id%]['quote_description'] html
         * @return string $return[%plugin_id%]['after_quote_description'] html
         *
         * @return string $return[%plugin_id%]['before_quote_attachments'] html
         * @return string $return[%plugin_id%]['quote_attachments'] html
         * @return string $return[%plugin_id%]['after_quote_attachments'] html
         *
         * @return string $return[%plugin_id%]['before_buttons'] html
         * @return string $return[%plugin_id%]['buttons'] html
         * @return string $return[%plugin_id%]['after_buttons'] html
         *
         * @return string $return[%plugin_id%]['before_hidden_block'] html
         * @return string $return[%plugin_id%]['hidden_block'] html
         * @return string $return[%plugin_id%]['after_hidden_block'] html
         */
        $params = array(
            'task' => $task
        );
        $task['hooks'] = array(
            'backend_task' => wa()->event('backend_task', $params)
        );
    }
}
