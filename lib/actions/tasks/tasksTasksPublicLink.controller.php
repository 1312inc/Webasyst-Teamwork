<?php

class tasksTasksPublicLinkController extends waJsonController
{
    public function execute()
    {
        $this->response = (new tasksApiTasksPublicLinkHandler())->publish(
            new tasksApiTasksPublicLinkRequest(
                waRequest::request('id', 0, waRequest::TYPE_INT),
                filter_var(waRequest::post('publish', false), FILTER_VALIDATE_BOOLEAN)
            )
        );
    }
}
