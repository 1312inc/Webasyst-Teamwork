<?php

/**
 * Single task page.
 */
class tasksTasksInfoAction extends waViewAction
{
    public $milestones;
    public $tags_cloud;
    public $statuses;

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

        (new tasksFavoriteModel())->markAsRead(wa()->getUser()->getId(), $task['id']);

        $this->workup($task);

        $links_prettifier = new tasksLinksPrettifier();
        $links_prettifier->addFromMarkdown($task['text']);

        $log = $task['log'];
        if ($log) {
            $task['log'] = $log;
            $last_log = end($log);
            if (($last_log['before_status_id'] != $last_log['after_status_id']) || $last_log['assigned_contact_id']) {
                if ($last_log['text']) {
                    $this->view->assign('last_log', $last_log);
                }
            }

            foreach($log as $l) {
                if ($l['text']) {
                    $links_prettifier->addFromMarkdown($l['text']);
                }
            }

        }

        $this->milestones = tasksHelper::getMilestones();
        foreach ($this->milestones as $id => $milestone) {
            if (!in_array($task->project_id, $milestone['related_projects'])) {
                unset($this->milestones[$id]);
            }
        }

        $this->tags_cloud = $tasks_tags_model->getCloud($task->project_id);
        $this->statuses = tasksHelper::getStatuses();

        $this->triggerGlobalEvent($task);

        $this->view->assign([
            'tags_cloud'                => $this->tags_cloud,
            'statuses'                  => $this->statuses,
            'task'                      => $task,
            'task_type'                 => $this->getTaskType($task),
            'task_ext_info_html'        => $this->getTaskExtInfo($task),
            'taskAssignedContactStatus' => (new tasksTeammateStatusService())->getForContactId($task->assigned_contact_id, new DateTimeImmutable()),
            'hash_type'                 => waRequest::get('from_hash_type', '', waRequest::TYPE_STRING_TRIM),
            'milestones'                => $this->milestones,
            'links_data'                => $links_prettifier->getData(),
            'user_roles'                => (new tasksTasksUserRoleModel())->getRoles(),
        ]);
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

    protected function triggerGlobalEvent($task)
    {
        /**
         * @event backend_task_info
         */
        return wa('tasks')->event('backend_task_info', ref([
            'task' => $task,
            'action' => $this,
        ]));
    }

    /**
     * @param tasksTask $task
     * @return array|null
     * @throws waDbException
     */
    private function getTaskType(tasksTask $task)
    {
        $model = new waModel();

        return $model->query("
            SELECT tte.*, ttt.name, ttt.color FROM tasks_task_ext tte 
            LEFT JOIN tasks_task_types ttt ON ttt.id = tte.type
            WHERE tte.task_id = i:task_id
        ", ['task_id' => $task['id']])->fetchAssoc();
    }

    /**
     * @param tasksTask $task
     * @return string
     * @throws SmartyException
     * @throws waException
     */
    private function getTaskExtInfo(tasksTask $task)
    {
        $fields = [];
        $fields_data = [];
        if ($task['id']) {
            $fields_data = (new tasksFieldDataModel())->getData($task['id']);
            if ($task_ext = (new tasksTaskExtModel())->getById($task['id'])) {
                $fields = (new tasksTask())->getFieldsByType();
                $fields = ifset($fields, $task_ext['type'], []);
            }
        }

        $view = wa()->getView();
        $view->assign([
            'fields'      => $fields,
            'fields_data' => $fields_data
        ]);

        return $view->fetch(wa()->getAppPath('templates/actions/tasks/includes/TasksExtInfo.inc.html', 'tasks'));
    }
}
