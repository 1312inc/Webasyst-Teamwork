<?php

class tasksTasksFavoriteController extends waJsonController
{
    public function execute()
    {
        $task_id = waRequest::get('id');
        $favorite_model = new tasksFavoriteModel();
        $favorite_model->changeFavorite($this->getUserId(), $task_id, waRequest::post('value'));
    }
}