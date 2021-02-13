<?php

class tasksBackendAction extends waViewAction
{
    public function execute()
    {
        if (waRequest::get('sidebar')) {
            $path = wa()->whichUI('tasks') === '2.0'
                ? wa('tasks')->getAppPath('templates/actions/backend/Sidebar.html')
                : wa('tasks')->getAppPath('templates/actions-legacy/backend/Sidebar.html')
            $this->setTemplate($path);
        } else {
            $this->view->assign(array(
                'app_icons' => self::getAppIcons(),
            ));
        }

        $tag_model = new tasksTaskTagsModel();
        $cloud = $tag_model->getCloud();

        $this->view->assign(array(
            'team_counts' => self::getTeamCounts(),
            'hidden_count' => self::getHiddenCount(),
            'outbox_count' => self::getOutboxCount(),
            'urgent_count' => self::getUrgentCount(),
            'status_counts' => self::getStatusCounts(),
            'favorites_counts' => self::getFavoritesCounts(),
            'super_urgent_count' => self::getSuperUrgentCount(),
            'is_admin' => wa()->getUser()->isAdmin('tasks'),
            'projects' => self::getProjectsWithCounts(),
            'lists' => $this->getLists(),
            'cloud' => $cloud,
            'scopes' => $this->getScopes(),
            'team_app_name' => $this->getTeamAppName(),
        ));

        /**
         * Include plugins js and css
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

    protected function getHiddenCount()
    {
        return self::getModel()->query('SELECT COUNT(*) FROM tasks_task WHERE hidden_timestamp > i:0 AND
assigned_contact_id = i:1', time(), $this->getUserId())->fetchField();
    }

    protected function getLists()
    {
        $lm = new tasksListModel();
        return $lm->getByField(array('contact_id' => $this->getUserId()), 'id');
    }

    protected function getScopes()
    {
        $tasks_milestone_model = new tasksMilestoneModel();
        $tasks_task_model = new tasksTaskModel();

        //Need set due_date 9999-12-31 to first show the red tasks, and without a period - the last
        $scopes = $tasks_milestone_model->where('closed=0')->order('IFNULL(due_date, \'9999-12-31 23:59:59\') ASC')->fetchAll('id');
        $projects = tasksHelper::getProjects();

        foreach ($scopes as $id => $scope) {
            if (!isset($projects[$scope['project_id']])) {
                unset($scopes[$id]);
                continue;
            }
            $scopes[$id]['project'] = $projects[$scope['project_id']];
        }

        $scope_counts = $tasks_task_model->getCountTasksInScope();
        if ($scope_counts) {
            //Calculate percent closed tasks
            foreach ($scope_counts as $count) {
                if (isset($scopes[$count['milestone_id']])) {
                    $percent = $count['closed'] / $count['total'] * 100;
                    $percent = round($percent);
                    $scopes[$count['milestone_id']]['closed_percent'] = $percent;
                }
            }
        }

        return $scopes;
    }

    protected static function getTeamCounts()
    {
        $result = self::getModel()->getTeamCounts();
        if (!wa()->getUser()->isAdmin('tasks')) {
            // Non-admin can only see own counter
            $result = array_intersect_key($result, array(wa()->getUser()->getId() => 1));
        }
        return $result;
    }

    protected static function getStatusCounts()
    {
        if (wa()->getUser()->isAdmin('tasks')) {
            return self::getModel()->query('
                SELECT status_id, COUNT(*)
                FROM tasks_task t JOIN tasks_project p ON t.project_id = p.id
                WHERE p.archive_datetime IS NULL
                GROUP BY status_id
            ')->fetchAll('status_id', true);
        }
        return null;
    }

    protected static function getProjectsWithCounts()
    {
        $projects = tasksHelper::getProjects();

        // Get list of projects user has full access to
        if (wa()->getUser()->isAdmin('tasks')) {
            $managed_project_ids = array_fill_keys(array_keys($projects), 1);
        } else {
            $managed_project_ids = array();
            $project_rights = wa()->getUser()->getRights('tasks', 'project.%');
            foreach($projects as $id => $p) {
                if (ifset($project_rights[$id], 0) >= 2) {
                    $managed_project_ids[$id] = 1;
                }
            }
        }

        // Prepare counts for empty projects and projects user has no access to
        foreach($projects as $id => &$p) {
            if (!empty($managed_project_ids[$id])) {
                $p += array(
                    'total' => 0,
                    'count' => 0,
                    'priority_count' => array(
                        'name' => '',
                        'text_color'=> '#999',
                        'bg_color' => 'transparent',
                    ),
                );
            } else {
                $p += array(
                    'total' => null,
                    'count' => null,
                    'priority_count' => null,
                );
            }
        }
        unset($p);

        // Prepare counts for projects user has full access to
        if ($managed_project_ids) {
            $project_counts = self::getModel()->getProjectCounts();
            foreach($project_counts as $id => $c) {
                if(!empty($managed_project_ids[$id]) && !empty($projects[$id])) {
                    $projects[$id]['count'] = $c['count'];
                    $projects[$id]['total'] = $c['total'];
                    $projects[$id]['priority_count'] = $c;
                }
            }
        }

        return $projects;
    }

    public static function getFavoritesCounts()
    {
        return self::getModel()->getFavoritesCounts();
    }

    public static function getOutboxCount()
    {
        $c = new tasksCollection('outbox');
        return $c->count();
    }

    public static function getUrgentCount()
    {
        $c = new tasksCollection('urgent');
        return $c->count();
    }

    public static function getSuperUrgentCount()
    {
        $c = new tasksCollection('urgent');
        $c->filter('priority>1');
        return $c->count();
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
        $result = array();
        $wa_url = wa()->getRootUrl();
        foreach(wa()->getApps() as $app_id => $app) {
            $result[$app_id] = $wa_url.$app['icon'][16];
        }
        return $result;
    }

    protected function getTeamAppName()
    {
        $apps = array('team', 'crm', 'contacts');
        foreach ($apps as $app_id) {
            if (wa()->appExists($app_id)) {
                $info = wa()->getAppInfo($app_id);
                return $info['name'];
            }
        }
        return _w('Team');
    }
}
