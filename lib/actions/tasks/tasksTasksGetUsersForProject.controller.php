<?php

class tasksTasksGetUsersForProjectController extends waJsonController
{
    public function execute()
    {
        $projectId = waRequest::request('project_id', null, waRequest::TYPE_INT);

        $this->response = (new tasksApiTeamGetTopAssigneesHandler())
            ->getUsers(new tasksApiTeamGetTopAssigneesRequest($projectId));
    }
}
