<?php

class tasksNotificationsSender
{
    public const EVENT_DONE    = 'done';
    public const EVENT_NEW     = 'new';
    public const EVENT_ASSIGN  = 'assign';
    public const EVENT_INVITE_ASSIGN  = 'inviteAssign';
    public const EVENT_EDIT    = 'edit';
    public const EVENT_COMMENT = 'comment';

    protected $task;
    protected $log_item;
    protected $actions;

    protected $options = [
        'check_rights' => true,
    ];

    // in sort of priority, don't change it
    protected $available_actions = [
        self::EVENT_DONE,
        self::EVENT_NEW,
        self::EVENT_ASSIGN,
        self::EVENT_INVITE_ASSIGN,
        self::EVENT_EDIT,
        self::EVENT_COMMENT,
    ];

    /**
     * @var tasksPushSenderService
     */
    private $pushSender;

    public function __construct($task, $actions = null, $options = [])
    {
        $actions = is_scalar($actions) ? (array) $actions : $actions;
        $actions = is_array($actions) ? $actions : [];
        if (!$actions) {
            $actions = $this->available_actions;
        }
        $this->actions = $actions;

        $task_model = new tasksTaskModel();
        if (is_scalar($task)) {
            $task = $task_model->getById($task);
        }
        $this->task = $task;
        $log_model = new tasksTaskLogModel();
        $this->log_item = $log_model->getLast($this->task['id']);

        $this->options = array_merge($this->options, $options);

        $this->pushSender = new tasksPushSenderService();
    }

    /**
     * Send notifications for all contacts that need CONCRETE
     *      notification about action in task (passed by constructor)
     *
     * Make sure that sent each contact not more than one notification
     *
     * @throws waException
     * @see __construct
     */
    public function send()
    {
        $send_map = $this->prepareSendMap();

        // Make sure two notifications (diff types) are not sent to the same person (if author is assigned for example)
        // To prevent it order by action
        // Priority order like in defined in instance proper

        $order = $this->available_actions;
        $send_map_keys = array_keys($send_map);
        foreach ($this->uniqueMerge($order, $send_map_keys) as $action) {
            if (isset($send_map[$action])) {
                $send_to = $send_map[$action];
                unset($send_map[$action]);
                // set in new order
                $send_map[$action] = $send_to;
            }
        }

        $already_sent = [];
        foreach ($send_map as $action => $contact_ids) {
            $contact_ids = array_unique($contact_ids);
            foreach ($contact_ids as $contact_id) {
                if (empty($already_sent[$contact_id])) {
                    $this->sendOne($action, $contact_id);
                    $already_sent[$contact_id] = true;
                }
            }
        }
    }

    /**
     * Send notification to contact (except myself)
     *
     * @param string $type
     * @param int    $to_contact_id
     *
     * @throws waException
     */
    public function sendOne(string $type, $to_contact_id): void
    {
        if ($to_contact_id == wa()->getUser()->getId()) {
            return;
        }

        $to = new waContact($to_contact_id);

        $oldLocale = wa()->getLocale();
        try {
            wa()->setLocale($to->getLocale());

            tasksNotifications::send($type, $this->task, $this->log_item, $to, $this->options['templateData'] ?? []);

            $this->pushSender->send($type, $this->task, $this->log_item, $to);
        } catch (Exception $exception) {
            tasksLogger::error($exception);
        }
        wa()->setLocale($oldLocale);
    }

    /**
     * Get map for each action to which contacts send notification
     *
     * @return array <string> => int[]
     * @throws waException
     */
    protected function prepareSendMap()
    {
        $settings = $this->getContactsNotificationSettings('all', [
            $this->task['create_contact_id'],
            $this->task['assigned_contact_id'],
        ]);

        $send_map = [];
        foreach ($this->actions as $action) {
            $send_map[$action] = $this->getContactIdsNeedSentTo($action, $settings);
        }

        return $send_map;
    }

    /**
     * Merge maps and extract unique values
     *
     * @param $ar1
     * @param $ar2
     *
     * @return array
     */
    protected function uniqueMerge($ar1, $ar2)
    {
        $ar1 = array_merge($ar1, $ar2);
        $ar1 = array_unique($ar1);
        $ar1 = array_values($ar1);

        return $ar1;
    }

    /**
     * Get contact IDS to which need sent notification if this action occurred
     *
     * @param string $action
     * @param array  $settings
     *
     * @return array
     * @throws waException
     */
    protected function getContactIdsNeedSentTo($action, $settings)
    {
        $contact_ids = array_keys($settings);
        $send_to = [];
        foreach ($contact_ids as $contact_id) {
            if (isset($settings[$contact_id]) &&
                $this->needSent($contact_id, $action, $settings[$contact_id])) {
                $send_to[] = $contact_id;
            }
        }

        return array_unique($send_to);
    }

    /**
     * Check need sent notification to this contact
     *
     * @param int    $contact_id
     * @param string $action
     * @param array  $settings - sent settings for this contact
     *
     * @return bool
     * @throws waException
     */
    protected function needSent($contact_id, $action, $settings)
    {
        return $this->checkNeedSentByAction($action, $settings) &&
            $this->checkNeedSentByTask($contact_id, $settings);
    }

    /**
     * Check need sent notification to this contact by exploration 'action' setting of sent settings
     *
     * @param string $action
     * @param array  $settings - sent settings for THIS CONTACT
     *
     * @return bool
     */
    protected function checkNeedSentByAction($action, $settings)
    {
        if ($settings['action'] === 'always') {
            return true;
        }
        if ($settings['action'] === 'off') {
            return false;
        }

        // consider that new is always assignment
        return $settings['action'] === 'assign' && ($action === 'assign' || $action === 'new');
    }

    /**
     * Check need sent notification to this contact by exploration 'task' setting of sent settings
     *
     * @param int   $contact_id
     * @param array $settings
     *
     * @return bool
     * @throws waException
     */
    protected function checkNeedSentByTask($contact_id, $settings)
    {
        if ($this->options['check_rights']) {
            $rights = new tasksRights();
            if (!$rights->canViewTask($this->task, $contact_id)) {
                return false;
            }
        }

        $task_map = array_fill_keys($settings['task'], true);

        if (!empty($task_map['assigned_to_me'])) {
            if ($this->task['assigned_contact_id'] == $contact_id) {
                return true;
            }
        }
        if (!empty($task_map['created_by_me'])) {
            if ($this->task['create_contact_id'] == $contact_id) {
                return true;
            }
        }
        if (!empty($task_map['favorites'])) {
            $fm = new tasksFavoriteModel();
            if ($fm->getByField([
                'contact_id' => $contact_id,
                'task_id' => $this->task['id'],
            ])) {
                return true;
            }
        }
        if (!empty($task_map['project'])) {
            $pm = new tasksProjectModel();
            $project = $pm->getById($this->task['project_id']);
            if ($project && $project['archive_datetime'] == null) {
                if (in_array($this->task['project_id'], $settings['project'])) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * @param null|int|int[]|'all' $contact_id
     *   - null current user
     *   - int|int[] specific contact(s)
     *   - 'all' means all contacts that have personal settings saved
     *
     * @param int[] $extra_contact_ids
     *
     * @return array
     */
    protected function getContactsNotificationSettings($contact_id = null, $extra_contact_ids = [])
    {
        /**
         * @var $config tasksConfig
         */
        $config = wa('tasks')->getConfig();
        $settings = $config->getPersonalNotificationSettings($contact_id);
        if (is_scalar($contact_id) && $contact_id !== 'all') {
            $settings = [$contact_id => $settings];
        }
        $extra = $config->getPersonalNotificationSettings($extra_contact_ids);
        $settings = waUtils::getFieldValues($settings, 'notification', true);
        $extra = waUtils::getFieldValues($extra, 'notification', true);
        foreach ($extra as $id => $ar) {
            $settings[$id] = $ar;
        }
        if (is_scalar($contact_id) && $contact_id !== 'all' && !$extra_contact_ids) {
            $settings = $settings[$contact_id];
        }

        return $settings;
    }
}
