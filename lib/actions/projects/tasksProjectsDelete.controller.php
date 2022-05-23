<?php

class tasksProjectsDeleteController extends waJsonController
{
    public function execute()
    {
        (new tasksApiProjectDeleteHandler())
            ->delete(
                new tasksApiProjectDeleteRequest(waRequest::post('id', 0, waRequest::TYPE_INT))
            );
    }
}