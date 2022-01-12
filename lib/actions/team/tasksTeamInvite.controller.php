<?php

class tasksTeamInviteController extends waJsonController
{
    public function execute()
    {
        try {
            $result = (new tasksApiTeamInviteToTaskHandler())->invite(
                new tasksApiTeamInviteToTaskRequest(
                    new tasksValueEmail(waRequest::post('email', null, waRequest::TYPE_STRING_TRIM)),
                    waRequest::post('task_id', 0, waRequest::TYPE_INT),
                    waRequest::post('access_right', null, waRequest::TYPE_INT) ?: 0
                )
            );

            if ($result->getContactId()) {
                $this->response = ['contact_id' => $result->getContactId()];
            } else {
                $this->setError($result->getErrorDescription());
            }
        } catch (Exception $exception) {
            $this->setError($exception->getMessage());
        }
    }
}
