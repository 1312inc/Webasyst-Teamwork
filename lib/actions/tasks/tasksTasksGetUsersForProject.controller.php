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
            $item = array_intersect_key($item, [
                'id' => 1,
                'name' => 1,
                'firstname' => 1,
                'middlename' => 1,
                'lastname' => 1,
                'title' => 1,
                'company' => 1,
                'jobtitle' => 1,
                'is_company' => 1,
                'is_user' => 1,
                'is_staff' => 1,
                'login' => 1,
                'photo_url' => 1,
                'sex' => 1,
                'birth_day' => 1,
                'birth_month' => 1,
                'birth_year' => 1,
                'about' => 1,
                'calendar_status' => 1
            ]);

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
