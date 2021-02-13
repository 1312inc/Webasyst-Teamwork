<?php

class tasksProjectsDeleteController extends waJsonController
{
    public function execute()
    {
        $project_model = new tasksProjectModel();
        $project_model->deleteById(waRequest::post('id', 0, 'int'));
    }
}