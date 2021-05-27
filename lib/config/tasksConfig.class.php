<?php

class tasksConfig extends waAppConfig
{
    public const APP_ID = 'tasks';

    /**
     * @var tasksHydratorInterface
     */
    private $hydrator;

    /**
     * @var tasksPersister
     */
    private $persister;

    /**
     * @var tasksBaseFactory[]
     */
    private $entityFactories = [];

    /**
     * @var tasksModel[]
     */
    private $models = [];

    /**
     * @var tasksBaseRepository[]
     */
    private $repositories = [];

    /**
     * @var tasksRightsResolver
     */
    private $rightResolver;

    public function getHydrator(): tasksHydratorInterface
    {
        if ($this->hydrator === null) {
            $this->hydrator = new tasksHydrator();
        }

        return $this->hydrator;
    }

    public function getPersister(): tasksPersister
    {
        if ($this->persister === null) {
            $this->persister = new tasksPersister();
        }

        return $this->persister;
    }

    public function init()
    {
        parent::init();

        $this->models[''] = new tasksModel();
        $this->repositories[''] = new tasksBaseRepository('');
        $this->entityFactories[''] = new tasksBaseFactory();

        $this->registerGlobal();
    }

    /**
     * @return tasksRightsResolver
     */
    public function getRightResolver(): tasksRightsResolver
    {
        if ($this->rightResolver === null) {
            $this->rightResolver = new tasksRightsResolver();
        }

        return $this->rightResolver;
    }

    /**
     * @param string $entity
     *
     * @return mixed|tasksBaseFactory
     */
    public function getEntityFactory(string $entity)
    {
        if (isset($this->entityFactories[$entity])) {
            return $this->entityFactories[$entity];
        }

        $factoryClass = sprintf('%sFactory', $entity);

        if (!class_exists($factoryClass)) {
            return $this->entityFactories['']->setEntity($entity);
        }

        $this->entityFactories[$entity] = new $factoryClass();
        $this->entityFactories[$entity]->setEntity($entity);

        return $this->entityFactories[$entity];
    }

    /**
     * @param string|null $entity
     *
     * @return mixed|tasksModel
     */
    public function getModel(?string $entity)
    {
        if ($entity === null) {
            return $this->models[''];
        }

        if (isset($this->models[$entity])) {
            return $this->models[$entity];
        }

        $modelClass = sprintf('%sModel', $entity);
        if (!class_exists($modelClass)) {
            return $this->models[''];
        }

        $this->models[$entity] = new $modelClass();

        return $this->models[$entity];
    }

    /**
     * @param string $entity
     *
     * @return tasksEntityRepositoryInterface
     */
    public function getEntityRepository(string $entity): tasksEntityRepositoryInterface
    {
        if (isset($this->repositories[$entity])) {
            return $this->repositories[$entity]->resetLimitAndOffset();
        }

        $repositoryClass = sprintf('%sRepository', $entity);
        if (!class_exists($repositoryClass)) {
            return $this->repositories['']->setEntity($entity);
        }

        $this->repositories[$entity] = new $repositoryClass($entity);

        return $this->repositories[$entity];
    }

    public function onInit()
    {
        //if (wa()->getEnv() == 'backend' && wa()->getApp() == $this->application && wa()->getUser()->getId()) {
        //    $this->setCount($this->onCount());
        //}
    }

    public function getProjectColors()
    {
        return ifset($this->options['project_colors'], []);
    }

    public function getProjectIcons()
    {
        return ifset($this->options['project_icons'], []);
    }

    public function getStatusIcons()
    {
        return ifset($this->options['status_icons'], []);
    }

    public function checkRights($module, $action)
    {
        if (wa()->getUser()->isAdmin($this->application)) {
            return true;
        }

        // Some modules are only allowed for admins
        if (in_array($module, ['settings', 'projects', 'log', 'milestones', 'plugins'])) {
            return false;
        }

        // Everything else is available to everybody
        return true;
    }


    /**
     * Format params in to wa_log:
     * 'task_add' = task['id']
     * 'task_edit', 'task_forward', 'task_return', 'task_action', 'task_comment' = task['task_id'].':'.log_item['id']
     *
     * @param $logs
     *
     * @return mixed
     * @throws waException
     */
    public function explainLogs($logs)
    {
        $is_admin = wa()->getUser()->isAdmin('tasks');
        $rights = wa()->getUser()->getRights('tasks', 'project.%');

        $rights_collect = [];
        if (!$is_admin && !$rights) {
            //clear data If user not have rights. See wa-system/webasyst/lib/actions/dashboard/webasystDashboardActivity.action.php:105
            return array_fill_keys(array_keys($logs), null);
        } elseif (!$is_admin && $rights) {

            $rights_collect = [];
            foreach ($rights as $project_id => $right) {
                if ((int) $right == tasksRightConfig::RIGHT_ASSIGNED) {
                    $rights_collect['assign'][] = $project_id;
                } elseif ((int) $right >= tasksRightConfig::RIGHT_FULL) {
                    $rights_collect['admin'][] = $project_id;
                }
            }

            if (!$rights_collect) {
                return array_fill_keys($logs, null);
            }
        }

        $logs = parent::explainLogs($logs);
        $app_url = wa()->getConfig()->getBackendUrl(true) . $this->getApplication() . '/';

        $tasks_type = ['task_add', 'task_edit', 'task_forward', 'task_return', 'task_action', 'task_comment'];
        $task_ids = [];

        foreach ($logs as $l_id => $l) {
            if (in_array($l['action'], $tasks_type) && $l['params']) {
                $t = explode(':', $l['params']);
                $task_ids[$t[0]] = $t[0];
            }
        }

        $tasks = [];
        if ($task_ids) {
            $task_model = new tasksTaskModel();
            $admin_tasks = [];
            $assign_tasks = [];

            if ($is_admin) {
                $admin_tasks = $task_model->getById(array_keys($task_ids));
            } elseif (!empty($rights_collect['admin'])) {
                $admin_tasks = $task_model->getByField(
                    [
                        'id' => array_keys($task_ids),
                        'project_id' => $rights_collect['admin'],
                    ],
                    'id'
                );
            }

            if (!empty($rights_collect['assign'])) {
                //Return tasks assigned for active user
                $assign_tasks = $task_model->getByField(
                    [
                        'id' => array_keys($task_ids),
                        'assigned_contact_id' => wa()->getUser()->getId(),
                        'project_id' => $rights_collect['assign'],
                    ],
                    'id'
                );
            }

            $tasks = $assign_tasks + $admin_tasks;

            //Clear not assigned task from log
            foreach ($logs as $l_id => $l) {
                if ($l['params']) {
                    $t = explode(':', $l['params']);
                    if (empty($tasks[$t[0]])) {
                        $logs[$l_id] = [];
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
                            $logs[$l_id]['params_html'] = '(' . _w('%d task', '%d tasks', $l['params']) . ')';
                        }
                        continue;
                    }
                }
                if ($t) {
                    //If name not found, need set dummy
                    if (empty($t['name'])) {
                        $t['name'] = _wd('tasks', "(no name)");
                    }
                    $url = $app_url . '#/task/' . $t['project_id'] . '.' . $t['number'] . '/';
                    $logs[$l_id]['params_html'] .= '<div class="activity-target"><a href="' . $url . '">' . htmlspecialchars(
                            $t['name']
                        ) . '</a></div>';
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

        $contact_ids = is_scalar($contact_id) ? (array) $contact_id : $contact_id;
        if (!$contact_ids || !is_array($contact_ids)) {
            return [];
        }
        $contact_ids = array_map('intval', $contact_ids);
        if (!$contact_ids) {
            return [];
        }

        $csm = new waContactSettingsModel();

        $where = [];
        if ($contact_id !== 'all') {
            $where[] = 'contact_id IN(:ids)';
        }
        $where[] = "app_id = 'tasks'";
        $where[] = "name = 'settings/notification'";
        $where = join(' AND ', $where);

        $notifications = $csm->select('contact_id, value')
            ->where($where, ['ids' => $contact_ids])
            ->fetchAll('contact_id', true);

        $settings = [];

        if ($contact_id === 'all') {
            $contact_ids = array_keys($notifications);
        }

        foreach ($contact_ids as $id) {

            $notification = [];
            if (isset($notifications[$id])) {
                $notification = json_decode($notifications[$id], true);
                if (!is_array($notification)) {
                    $notification = [];
                }
            }

            if (!isset($notification['action'])) {
                $notification['action'] = '';
            }
            if (!in_array($notification['action'], ['always', 'assign', 'off'])) {
                $notification['action'] = 'always';
            }
            if (!isset($notification['task'])) {
                $notification['task'] = [];
            }
            if (is_scalar($notification['task'])) {
                $notification['task'] = (array) $notification['task'];;
            }
            if (!is_array($notification['task'])) {
                $notification['task'] = [];
            }

            // default 'task' settings
            if (empty($notification['task']) && $notification['action'] !== 'off') {
                $notification['task'][] = 'assigned_to_me';
                $notification['task'][] = 'created_by_me';
            }

            foreach ($notification['task'] as &$value) {
                if (!in_array($value, ['assigned_to_me', 'created_by_me', 'favorites', 'project'])) {
                    $value = 'assigned_to_me';
                }
            }
            unset($value);

            $notification['task'] = array_unique($notification['task']);

            if (!isset($notification['project'])) {
                $notification['project'] = [];
            }
            if (is_scalar($notification['project'])) {
                $notification['project'] = (array) $notification['project'];
            }
            if (!is_array($notification['project'])) {
                $notification['project'] = [];
            }

            $settings[$id] = ['notification' => $notification];
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
            $settings = [];
        }
        if (!isset($settings['notification']) || !is_array($settings['notification'])) {
            $settings['notification'] = [];
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
            if ($notification['task'] === ['assigned_to_me', 'created_by_me'] && $notification['action'] == 'always') {
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

    public function getUI2TemplatePath($path)
    {
        return sprintf($path, wa()->whichUI(self::APP_ID) == '1.3' ? '-legacy' : '');
    }

    /**
     * The method returns a counter to show in backend header near applications' icons.
     * Three types of response are allowed.
     * @return string|int|array - A prime number in the form of a int or string
     * @return array - Array with keys 'count' - the value of the counter and 'url' - icon url
     * @return array - An associative array in which the key is the object key from app.php, from the header_items.
     *                 The value must be identical to the value described in one of the previous types of response.
     */
    public function onCount()
    {
        try {
            $countService = new tasksUserTasksCounterService();
            $user = wa()->getUser();

            $teamCounts = $countService->getTeamCounts($user);
            $userCount = $teamCounts[$user->getId()] ?? ['count' => 0, 'total' => 0];
            $hiddenCount = $countService->getHiddenCount($user);
            if ($userCount['total'] == $userCount['count']) {
                $inboxUrgentCount = $userCount['count'] - $hiddenCount;
            } else {
                $inboxUrgentCount = $userCount['count'];
            }

            return $inboxUrgentCount && $inboxUrgentCount != ($userCount['total'] - $hiddenCount)
                ? $inboxUrgentCount
                : null;
        } catch (Exception $exception) {
            // silence
        }

        return null;
    }

    private function registerGlobal(): void
    {
        if (!function_exists('tsks')) {
            /**
             * @return tasksConfig|SystemConfig|waAppConfig
             */
            function tsks()
            {
                return wa(tasksConfig::APP_ID)->getConfig();
            }
        }
    }
}
