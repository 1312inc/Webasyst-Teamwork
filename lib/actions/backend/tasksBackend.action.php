<?php

class tasksBackendAction extends waViewAction
{
    public function execute()
    {
        if (waRequest::get('sidebar')) {
            $this->setTemplate(
                wa('tasks')->getAppPath(tsks()->getUI2TemplatePath('templates/actions%s/backend/Sidebar.html'))
            );
        } else {
            $this->view->assign(['app_icons' => self::getAppIcons()]);
        }

        $tag_model = new tasksTaskTagsModel();
        $cloud = $tag_model->getCloud();

        $is_tasks_admin = wa()->getUser()->isAdmin('tasks');
        $users = (new tasksTeamGetter())->getTeam(new taskTeamGetterParamsDto(null, $is_tasks_admin ? false : true, false, true, true));

        $accessedProjects = (new tasksRights())
            ->getAvailableProjectForContact(wa()->getUser());

        $countService = new tasksUserTasksCounterService();
        $this->view->assign([
            'team_counts'             => $countService->getTeamCounts(wa()->getUser()),
            'hidden_count'            => $countService->getHiddenCount(wa()->getUser()),
            'outbox_count'            => $countService->getOutboxCount(),
            'urgent_count'            => $countService->getUrgentCount(),
            'status_counts'           => $countService->getStatusCounts(wa()->getUser()),
            'favorites_counts'        => $countService->getFavoritesCounts(),
            'super_urgent_count'      => $countService->getSuperUrgentCount(),
            'is_admin'                => wa()->getUser()->isAdmin('tasks'),
            'projects'                => self::getProjectsWithCounts(),
            'lists'                   => $this->getLists(),
            'cloud'                   => $cloud,
            'scopes'                  => $this->getScopes($accessedProjects),
            'team_app_name'           => $this->getTeamAppName(),
            'users'                   => $users,
            'text_editor'             => wa()->getUser()->getSettings('tasks', 'text_editor', 'wysiwyg'),
            'user_has_minimum_access' => $accessedProjects === true || !empty($accessedProjects[tasksRights::PROJECT_ANY_ACCESS]),
            'is_premium'              => tasksLicensing::check('tasks')->hasPremiumLicense()
        ]);

        /**
         * Include plugins js and css
         *
         * @event backend_assets
         * @return array[string]string $return[%plugin_id%] Extra head tag content
         */
        $this->view->assign('backend_assets', wa('tasks')->event('backend_assets'));


        /*
         * @event backend_sidebar
         * @return array[string]array $return[%plugin_id%] array of html output
         * @return array[string][string]string $return[%plugin_id%]['top_li'] html output
         * @return array[string][string]string $return[%plugin_id%]['bottom_li'] html output
         * @return array[string][string]string $return[%plugin_id%]['section'] html output
         */
        $backend_sidebar = wa()->event('backend_sidebar');
        $this->view->assign('backend_sidebar', $backend_sidebar);
    }

    protected function getLists()
    {
        $lm = new tasksListModel();

        return $lm->getByField(['contact_id' => $this->getUserId()], 'id');
    }

    protected function getScopes($accessedProjects)
    {
        $tasks_milestone_model = new tasksMilestoneModel();
        $tasks_task_model = new tasksTaskModel();

        $scopes = $tasks_milestone_model->getMilestonesWithOrder(false);
        $projects = tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray();

        foreach ($scopes as $id => $scope) {
            if (!isset($projects[$scope['project_id']])) {
                unset($scopes[$id]);
                continue;
            }
            $scopes[$id]['project_access_full'] = $accessedProjects === true || in_array($scope['project_id'], $accessedProjects[tasksRights::PROJECT_ACCESS_FULL]);
            $scopes[$id]['project'] = $projects[$scope['project_id']];
        }
        if (!$scopes) {
            return $scopes;
        }

        $scope_counts = $tasks_task_model->getCountTasksInScope();
        foreach($scopes as $scope_id => $scope) {
            $count = ifset($scope_counts, $scope_id, [
                'milestone_id' => $scope_id,
                'closed' => 0,
                'total' => 0,
                'count' => 0,
                'bg_color' => 'transparent',
                'text_color' => 'transparent',
            ]);

            if ($scope['project_access_full']) {
                $percent = $count['total'] ? $count['closed'] / $count['total'] * 100 : 0;
                $percent = round($percent);
                $scopes[$scope_id]['closed_percent'] = $percent;
                $scopes[$scope_id]['closed_tasks'] = $count['closed'];
                $scopes[$scope_id]['open_tasks'] = $count['total'] - $count['closed'];
                $scopes[$scope_id]['proirity_tasks'] = $count['count'];
                $scopes[$scope_id]['priority_count_bg_color'] = $count['bg_color'];
                $scopes[$scope_id]['priority_count_text_color'] = $count['text_color'];
            }
        }

        return $scopes;
    }

    protected static function getProjectsWithCounts()
    {
        $projects = tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray();

        // Get list of projects user has full access to
        if (wa()->getUser()->isAdmin('tasks')) {
            $managed_project_ids = array_fill_keys(array_keys($projects), 1);
        } else {
            $managed_project_ids = [];
            $project_rights = wa()->getUser()->getRights('tasks', 'project.%');
            foreach ($projects as $id => $p) {
                if (ifset($project_rights[$id], 0) >= 2) {
                    $managed_project_ids[$id] = 1;
                }
            }
        }

        // Prepare counts for empty projects and projects user has no access to
        foreach ($projects as $id => &$p) {
            if (!empty($managed_project_ids[$id])) {
                $p += [
                    'total' => 0,
                    'count' => 0,
                    'priority_count' => [
                        'name' => '',
                        'text_color' => '#999',
                        'bg_color' => 'transparent',
                    ],
                ];
            } else {
                $p += [
                    'total' => null,
                    'count' => null,
                    'priority_count' => null,
                ];
            }
        }
        unset($p);

        // Prepare counts for projects user has full access to
        if ($managed_project_ids) {
            $project_counts = (new tasksTasksCounterService())->getProjectCountsWithPriority();
//            $project_counts = self::getModel()->getProjectCounts();
            foreach ($project_counts as $id => $c) {
                if (!empty($managed_project_ids[$id]) && !empty($projects[$id])) {
                    $projects[$id]['count'] = $c['count'];
                    $projects[$id]['total'] = $c['total'];
                    $projects[$id]['priority_count'] = $c;
                }
            }
        }

        return $projects;
    }

    protected static function getModel()
    {
        static $task_model = null;
        if ($task_model === null) {
            $task_model = new tasksTaskModel();
        }

        return $task_model;
    }

    protected static function getAppIcons()
    {
        $result = [];
        $wa_url = wa()->getRootUrl();
        foreach (wa()->getApps() as $app_id => $app) {
            $result[$app_id] = $wa_url . $app['icon'][16];
        }

        return $result;
    }

    protected function getTeamAppName()
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
