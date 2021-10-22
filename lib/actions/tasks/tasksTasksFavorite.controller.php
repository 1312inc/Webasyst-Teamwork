<?php

class tasksTasksFavoriteController extends waJsonController
{
    public function execute()
    {
        (new tasksApiTasksFavoriteHandler())->favorite(
            new tasksApiTasksFavoriteRequest(
                waRequest::request('id', 0, waRequest::TYPE_INT),
                filter_var(waRequest::post('value', false), FILTER_VALIDATE_BOOLEAN),
                $this->getUserId()
            )
        );
    }
}
