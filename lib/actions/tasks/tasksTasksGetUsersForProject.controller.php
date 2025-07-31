<?php

class tasksTasksGetUsersForProjectController extends waJsonController
{
    public function execute()
    {
        $rights_info = [];
        $projectId = waRequest::request('project_id', null, waRequest::TYPE_INT);
        $task_id = waRequest::request('task_id', null, waRequest::TYPE_INT);
        $users = (new tasksApiTeamGetTopAssigneesHandler())->getUsers(new tasksApiTeamGetTopAssigneesRequest($projectId));

        if ($task_id) {
            $tasks = [new tasksTask($task_id)];
            (new tasksRights())->extendTasksByRightsInfo($tasks, array_column($users, 'id'));
            $rights_info = ifset($tasks, 0, 'rights_info', []);
        }


        foreach ($users as &$item) {
            foreach (['name', 'firstname', 'middlename', 'title', 'company', 'jobtitle', 'about', 'login'] as $toEscape) {
                $item[$toEscape] = htmlspecialchars((string) $item[$toEscape]);
            }
            $item['rights_info'] = ifset($rights_info, $item['id'], []);
            if (!empty($item['calendar_status'])) {
                $item['calendar_status'] = [
                    'name' => $item['calendar_status']->getName(),
                    'bg_color' => $item['calendar_status']->getBgColor(),
                    'font_color' => $item['calendar_status']->getFontColor(),
                ];
            }
        }

        $this->response = $users;
    }
}
