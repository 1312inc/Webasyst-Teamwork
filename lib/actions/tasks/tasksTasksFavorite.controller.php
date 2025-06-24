<?php

class tasksTasksFavoriteController extends waJsonController
{
    public function execute()
    {
        $task_id = waRequest::request('id', 0, waRequest::TYPE_INT);
        $user_id = (int)waRequest::request('user_id', $this->getUserId(), waRequest::TYPE_INT);
        $value = !!waRequest::request('value', false);

        (new tasksApiTasksFavoriteHandler())->favorite(
            new tasksApiTasksFavoriteRequest(
                $task_id,
                $value,
                $user_id
            )
        );
    }
}
