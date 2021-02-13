<?php

class tasksProjectsArchiveController extends waJsonController
{
    public function execute()
    {
        $project_id = waRequest::post('id', 0, 'int');

        if ($this->getUser()->getRights('tasks', 'project.'.$project_id) < tasksRightConfig::RIGHT_FULL) {
            throw new waRightsException(_ws('Access denied'));
        }

        $project_model = new tasksProjectModel();
        $project_model->updateById($project_id, array('archive_datetime' => date('Y-m-d H:i:s')));
    }
}