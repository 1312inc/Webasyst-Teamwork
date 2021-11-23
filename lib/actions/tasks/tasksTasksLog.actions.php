<?php

/**
 * Acetps POST from forms that perform actions with a task: forward, return, done etc.
 */
class tasksTasksLogActions extends waJsonActions
{
    /**
     * @var tasksApiTasksActionHandler
     */
    protected $taskActionHandler;

    protected function preExecute()
    {
        $this->taskActionHandler = new tasksApiTasksActionHandler();
    }

    public function forwardAction()
    {
        $this->response = $this->taskActionHandler->action(
            new tasksApiTasksActionRequest(
                waRequest::request('id', 0, waRequest::TYPE_INT),
                tasksTaskLogModel::ACTION_TYPE_FORWARD,
                waRequest::post('text'),
                (string) wa()->getRequest()->post('files_hash'),
                waRequest::post('assigned_contact_id', 0, waRequest::TYPE_INT),
                waRequest::post('status_id', 0, waRequest::TYPE_INT)
            )
        );
    }

    public function returnAction()
    {
        $this->response = $this->taskActionHandler->action(
            new tasksApiTasksActionRequest(
                waRequest::request('id', 0, waRequest::TYPE_INT),
                tasksTaskLogModel::ACTION_TYPE_RETURN,
                waRequest::post('text'),
                (string) wa()->getRequest()->post('files_hash'),
                waRequest::post('prev_actor_contact_id', 0, waRequest::TYPE_INT),
                waRequest::post('prev_status_id', 0, waRequest::TYPE_INT)
            )
        );
    }

    public function defaultAction()
    {
        $this->response = $this->taskActionHandler->action(
            new tasksApiTasksActionRequest(
                waRequest::request('id', 0, waRequest::TYPE_INT),
                tasksTaskLogModel::ACTION_TYPE_EMPTY,
                waRequest::post('text'),
                (string) wa()->getRequest()->post('files_hash'),
                waRequest::post('assigned_contact_id', null, waRequest::TYPE_INT),
                waRequest::post('status_id', -1, waRequest::TYPE_INT)
            )
        );
    }
}
