<?php

class tasksProjectsPublicLinkController extends waJsonController
{
    public function execute()
    {
        $this->response = (new tasksApiProjectsPublicLinkHandler())->publish(
            new tasksApiProjectsPublicLinkRequest(
                waRequest::request('id', 0, waRequest::TYPE_INT),
                filter_var(waRequest::post('publish', false), FILTER_VALIDATE_BOOLEAN)
            )
        );
    }
}
