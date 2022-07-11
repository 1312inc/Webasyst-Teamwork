<?php

class tasksActorsWidget extends tasksAbstractWidget
{
    public function defaultAction()
    {
        $this->incognitoUser();
        $users = (new tasksTeamGetter())->getTeam(new taskTeamGetterParamsDto(null, true, false, true));

        array_walk($users,  function(array &$user) {
            $user['tasks.total_tasks'] = 0;
            $user['tasks.count_pairs'] = $this->userCount($user['id'], $user['tasks.total_tasks']);
        });

        usort($users, static function (array $u1, array $u2) {
           return $u1['tasks.total_tasks'] <=> $u2['tasks.total_tasks'];
        });

        $this->display([
            'widget_id' => $this->id,
            'widget_url' => $this->getStaticUrl(),
            'users' => $users,
            'team_app_name' => $this->getTeamAppName(),
        ]);

        $this->incognitoLogout();
    }

    private function userCount($userId = null, &$total = 0)
    {
        if (wa()->getUser()->isAdmin('tasks')) {
            $countService = new tasksUserTasksCounterService();
            $teamCounts = $countService->getTeamCounts(wa()->getUser());
            $userCount = ifset($teamCounts[$userId], [
                'count' => 0,
                'total' => 0,
                'text_color' => '#999',
                'bg_color' => 'transparent',
            ]);

            $total = (int) $userCount['total'];

            return tasksUserTasksCounterService::getPairs(
                $userCount['total'],
                $userCount['count'],
                $userCount['bg_color'],
                $userCount['text_color']
            );
        }

        return '';
    }

    private function getTeamAppName()
    {
        $apps = ['team', 'crm', 'contacts'];
        foreach ($apps as $app_id) {
            if (wa()->appExists($app_id)) {
                $info = wa()->getAppInfo($app_id);

                return $info['name'];
            }
        }

        return _w('Team');
    }
}
