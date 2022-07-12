<?php

class tasksTasksGetUsersForProjectController extends waJsonController
{
    public function execute()
    {
        $projectId = waRequest::request('project_id', null, waRequest::TYPE_INT);

        $this->response = (new tasksApiTeamGetTopAssigneesHandler())
            ->getUsers(new tasksApiTeamGetTopAssigneesRequest($projectId));

        foreach ($this->response as &$item) {
            foreach (['name', 'firstname', 'middlename', 'title', 'company', 'jobtitle', 'about', 'login'] as $toEscape) {
                $item[$toEscape] = htmlspecialchars($item[$toEscape]);
            }
            if (!empty($item['calendar_status'])) {
                $item['calendar_status'] = [
                    'name' => $item['calendar_status']->getName(),
                    'bg_color' => $item['calendar_status']->getBgColor(),
                    'font_color' => $item['calendar_status']->getFontColor(),
                ];
            }
        }
    }
}
