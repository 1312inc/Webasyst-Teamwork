<?php

class tasksConfig extends waAppConfig
{
    public function onInit()
    {
        //if (wa()->getEnv() == 'backend' && wa()->getApp() == $this->application && wa()->getUser()->getId()) {
        //    $this->setCount($this->onCount());
        //}
    }

    public function getProjectColors()
    {
        return ifset($this->options['project_colors'], array());
    }

    public function getProjectIcons()
    {
        return ifset($this->options['project_icons'], array());
    }

    public function getStatusIcons()
    {
        return ifset($this->options['status_icons'], array());
    }

    public function checkRights($module, $action)
    {
        if (wa()->getUser()->isAdmin($this->application)) {
            return true;
        }

        // Some modules are only allowed for admins
        if (in_array($module, array('settings', 'projects', 'log', 'milestones', 'plugins'))) {
            return false;
        }

        // Everything else is available to everybody
        return true;
    }


    /**
     * Format params in to wa_log:
     * 'task_add' = task['id']
     * 'task_edit', 'task_forward', 'task_return', 'task_action', 'task_comment' = task['task_id'].':'.log_item['id']
     * @param $logs
     * @return mixed
     * @throws waException
     */
    public function explainLogs($logs)
    {
        $is_admin = wa()->getUser()->isAdmin('tasks');
        $rights = wa()->getUser()->getRights('tasks', 'project.%');

        $rights_collect = array();
        if (!$is_admin && !$rights) {
            //clear data If user not have rights. See wa-system/webasyst/lib/actions/dashboard/webasystDashboardActivity.action.php:105
            return array_fill_keys(array_keys($logs), null);
        } elseif (!$is_admin && $rights) {

            $rights_collect = array();
            foreach ($rights as $project_id => $right) {
                if ((int)$right == tasksRightConfig::RIGHT_ASSIGNED) {
                    $rights_collect['assign'][] = $project_id;
                } elseif ((int)$right >= tasksRightConfig::RIGHT_FULL) {
                    $rights_collect['admin'][] = $project_id;
                }
            }

            if (!$rights_collect) {
                return array_fill_keys($logs, null);
            }
        }

        $logs = parent::explainLogs($logs);
        $app_url = wa()->getConfig()->getBackendUrl(true).$this->getApplication().'/';

        $tasks_type = array('task_add', 'task_edit', 'task_forward', 'task_return', 'task_action', 'task_comment');
        $task_ids = array();

        foreach ($logs as $l_id => $l) {
            if (in_array($l['action'], $tasks_type) && $l['params']) {
                $t = explode(':', $l['params']);
                $task_ids[$t[0]] = $t[0];
            }
        }

        $tasks = array();
        if ($task_ids) {
            $task_model = new tasksTaskModel();
            $admin_tasks = array();
            $assign_tasks = array();

            if ($is_admin) {
                $admin_tasks = $task_model->getById(array_keys($task_ids));
            } elseif (!empty($rights_collect['admin'])) {
                $admin_tasks = $task_model->getByField(array(
                    'id'                  => array_keys($task_ids),
                    'project_id'          => $rights_collect['admin'],
                ), 'id');
            }

            if (!empty($rights_collect['assign'])) {
                //Return tasks assigned for active user
                $assign_tasks = $task_model->getByField(array(
                    'id'                  => array_keys($task_ids),
                    'assigned_contact_id' => wa()->getUser()->getId(),
                    'project_id'          => $rights_collect['assign']
                ), 'id');
            }

            $tasks = $assign_tasks + $admin_tasks;

            //Clear not assigned task from log
            foreach ($logs as $l_id => $l) {
                if ($l['params']) {
                    $t = explode(':', $l['params']);
                    if (empty($tasks[$t[0]])) {
                        $logs[$l_id] = array();
                    }
                }
            }
        }

        foreach ($logs as $l_id => $l) {
            //If log cleared, not need replace values
            if (!empty($l)) {
                $t = null;
                $logs[$l_id]['params_html'] = '';
                if (in_array($l['action'], $tasks_type) && $l['params']) {
                    $t_id = explode(':', $l['params']);
                    $t = ifset($tasks, $t_id[0], null);
                } else {
                    if ($l['action'] == 'task_delete') {
                        if ($l['params'] > 1) {
                            $logs[$l_id]['params_html'] = '('._w('%d task', '%d tasks', $l['params']).')';
                        }
                        continue;
                    }
                }
                if ($t) {
                    //If name not found, need set dummy
                    if (empty($t['name'])) {
                        $t['name'] = _wd('tasks', "(no name)");
                    }
                    $url = $app_url.'#/task/'.$t['project_id'].'.'.$t['number'].'/';
                    $logs[$l_id]['params_html'] .= '<div class="activity-target"><a href="'.$url.'">'.htmlspecialchars($t['name']).'</a></div>';
                }
            }
        }
        return $logs;
    }

    /**
     * @param null|int|int[]|'all' $contact_id
     *   - null current user
     *   - int|int[] specific contact(s)
     *   - 'all' means all contacts that have personal settings saved
     *
     * @return array|mixed
     */
    public function getPersonalSettings($contact_id = null)
    {
        if ($contact_id === null) {
            $contact_id = wa()->getUser()->getId();
        }

        $contact_ids = is_scalar($contact_id) ? (array)$contact_id : $contact_id;
        if (!$contact_ids || !is_array($contact_ids)) {
            return array();
        }
        $contact_ids = array_map('intval', $contact_ids);
        if (!$contact_ids) {
            return array();
        }

        $csm = new waContactSettingsModel();

        $where = array();
        if ($contact_id !== 'all') {
            $where[] = 'contact_id IN(:ids)';
        }
        $where[] = "app_id = 'tasks'";
        $where[] = "name = 'settings/notification'";
        $where = join(' AND ', $where);

        $notifications = $csm->select('contact_id, value')
                             ->where($where, array('ids' => $contact_ids))
                             ->fetchAll('contact_id', true);

        $settings = array();

        if ($contact_id === 'all') {
            $contact_ids = array_keys($notifications);
        }

        foreach ($contact_ids as $id) {

            $notification = array();
            if (isset($notifications[$id])) {
                $notification = json_decode($notifications[$id], true);
                if (!is_array($notification)) {
                    $notification = array();
                }
            }

            if (!isset($notification['action'])) {
                $notification['action'] = '';
            }
            if (!in_array($notification['action'], array('always', 'assign', 'off'))) {
                $notification['action'] = 'always';
            }
            if (!isset($notification['task'])) {
                $notification['task'] = array();
            }
            if (is_scalar($notification['task'])) {
                $notification['task'] = (array)$notification['task'];;
            }
            if (!is_array($notification['task'])) {
                $notification['task'] = array();
            }

            // default 'task' settings
            if (empty($notification['task']) && $notification['action'] !== 'off') {
                $notification['task'][] = 'assigned_to_me';
                $notification['task'][] = 'created_by_me';
            }

            foreach ($notification['task'] as &$value) {
                if (!in_array($value, array('assigned_to_me', 'created_by_me', 'favorites', 'project'))) {
                    $value = 'assigned_to_me';
                }
            }
            unset($value);

            $notification['task'] = array_unique($notification['task']);

            if (!isset($notification['project'])) {
                $notification['project'] = array();
            }
            if (is_scalar($notification['project'])) {
                $notification['project'] = (array)$notification['project'];
            }
            if (!is_array($notification['project'])) {
                $notification['project'] = array();
            }

            $settings[$id] = array('notification' => $notification);
        }

        if (is_scalar($contact_id) && $contact_id !== 'all') {
            return $settings[$contact_id];
        } else {
            return $settings;
        }
    }

    public function setPersonalSettings($settings, $contact_id = null)
    {
        if ($contact_id === null) {
            $contact_id = wa()->getUser()->getId();
        }
        $csm = new waContactSettingsModel();
        if (!is_array($settings)) {
            $settings = array();
        }
        if (!isset($settings['notification']) || !is_array($settings['notification'])) {
            $settings['notification'] = array();
        }

        $notification = null;
        if ($settings['notification']) {
            $notification = json_encode($settings['notification']);
        }

        if ($notification) {
            $csm->set($contact_id, 'tasks', 'settings/notification', $notification);

            $settings = $this->getPersonalSettings($contact_id);
            $notification = $settings['notification'];

            $looks_like_default = false;
            sort($notification['task'], SORT_STRING);
            if ($notification['task'] === array('assigned_to_me', 'created_by_me') && $notification['action'] == 'always') {
                $looks_like_default = true;
            }

            // don't store default value in DB
            // for optimizations reasons in notification sending
            // @see tasksNotificationsSender
            if ($looks_like_default) {
                $csm->delete($contact_id, 'tasks', 'settings/notification');
            }

        } else {
            $csm->delete($contact_id, 'tasks', 'settings/notification');
        }
    }
}
