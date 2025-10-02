<?php

class tasksMilestonesPublicLinkController extends waJsonController
{
    public function execute()
    {
        $this->response = (new tasksApiMilestonesPublicLinkHandler())->publish(
            new tasksApiMilestonesPublicLinkRequest(
                waRequest::request('id', 0, waRequest::TYPE_INT),
                filter_var(waRequest::post('publish', false), FILTER_VALIDATE_BOOLEAN)
            )
        );
    }
}
