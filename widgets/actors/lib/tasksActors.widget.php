<?php

class tasksActorsWidget extends tasksAbstractWidget
{
    public function defaultAction()
    {
        $this->incognitoUser();

        $this->display([
            'widget_id' => $this->id,
            'widget_url' => $this->getStaticUrl(),
            'users' => tasksHelper::getTeam(null, true, false, true),
            'team_app_name' => $this->getTeamAppName(),
        ]);

        $this->incognitoLogout();
    }

    public static function userCount($userId = null)
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
