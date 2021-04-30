<?php

/**
 * Acetps POST from forms that perform actions with a task: forward, return, done etc.
 */
class tasksTasksLogActions extends waJsonActions
{

    protected $task;
    /**
     * @var tasksTaskModel
     */
    protected $task_model;
    /**
     * @var tasksTaskLogModel
     */
    protected $log_model;

    protected function preExecute()
    {
        $this->task_model = new tasksTaskModel();
        $this->log_model = new tasksTaskLogModel();

        $task_id = waRequest::request('id', 0, 'int');
        $this->task = $this->task_model->getById($task_id);
        if (!$this->task) {
            throw new waException(_w('Task not found'), 404);
        }
    }

    public function forwardAction()
    {
        $hash = (string)wa()->getRequest()->post('files_hash');

        $log = tasksHelper::addLog($this->task, array(
            'action'              => tasksTaskLogModel::ACTION_TYPE_FORWARD,
            'status_id'           => waRequest::post('status_id', 0, 'int'),
            'assigned_contact_id' => waRequest::post('assigned_contact_id'),
            'text'                => waRequest::post('text'),
            'attachments_hash'    => $hash
        ));

        $this->logAction('task_forward', $log['task_id'].':'.$log['id']);
        $this->response = array(
            'id' => $log['id'],
        );
    }

    public function returnAction()
    {
        $status_id = waRequest::post('prev_status_id', 0, 'int');
        $prev_actor_id = waRequest::post('prev_actor_contact_id', 0, 'int');

        $task = new tasksTask($this->task);
        if ($status_id != $task['return_status']['id'] || $prev_actor_id != $task['return_actor']['id']) {
            $this->errors[] = _w('Cannot return this task because another user has modified it.');
            return;
        }

        $hash = (string)wa()->getRequest()->post('files_hash');

        $log = tasksHelper::addLog($this->task, array(
            'action'              => tasksTaskLogModel::ACTION_TYPE_RETURN,
            'status_id'           => $status_id,
            'assigned_contact_id' => $prev_actor_id,
            'text'                => waRequest::post('text'),
            'attachments_hash'    => $hash
        ));

        $this->logAction('task_return', $log['task_id'].':'.$log['id']);
        $this->response = array(
            'id' => $log['id'],
        );
    }

    public function defaultAction()
    {
        $data = array(
            'action'    => tasksTaskLogModel::ACTION_TYPE_EMPTY,
            'status_id' => waRequest::post('status_id', -1, 'int'),
            'text'      => waRequest::post('text', '', 'string')
        );

        $status = null;

        $statuses = tasksHelper::getStatuses();
        if (!empty($statuses[$data['status_id']])) {
            $status = $statuses[$data['status_id']];
            switch (ifempty($status['params']['assign'])) {
                case 'author':
                    $data['assigned_contact_id'] = $this->task['create_contact_id'];
                    break;
                case 'user':
                    $data['assigned_contact_id'] = ifempty($status['params']['assign_user'], null);
                    break;
                case 'select':
                    $assigned_contact_id = waRequest::post('assigned_contact_id', null, 'int');
                    if ($assigned_contact_id !== null) {
                        $data['assigned_contact_id'] = (int)$assigned_contact_id;
                    }
                    if (empty($status['params']['allow_clear_assign']) && empty($data['assigned_contact_id'])) {
                        unset($data['assigned_contact_id']);
                    }
                    break;
            }
        }

        $hash = (string)wa()->getRequest()->post('files_hash');
        $data['attachments_hash'] = $hash;

        $log = tasksHelper::addLog($this->task, $data);

        /**
         * @event save_status_form
         * For developer. Subject to change
         */
        $params = array(
            'data'      => array_merge($data,waRequest::post()),
            'status'    => $status,
        );

        wa('tasks')->event('save_status_form', $params);

        $this->logAction('task_action', $log['task_id'].':'.$log['id']);
        $this->response = array(
            'id' => $log['id'],
        );
    }
}
