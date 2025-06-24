<?php

final class tasksRights
{
    public const PROJECT_ACCESS_NONE                = 0;
    public const PROJECT_ACCESS_VIEW_ASSIGNED_TASKS = 1;
    public const PROJECT_ACCESS_FULL                = 2;
    public const PROJECT_ANY_ACCESS                 = -1;

    /**
     * @param tasksTask[]|array[] $tasks
     * @param int|int[]           $contact_id
     */
    public function extendTasksByRightsInfo(&$tasks, $contact_id = null)
    {
        $contact_id = $contact_id === null ? wa()->getUser()->getId() : $contact_id;
        $contact_ids = tasksHelper::toIntArray($contact_id);
        $input_contact_id = $contact_id;

        if (!$tasks || !$contact_ids) {
            return;
        }

        $empty_rights = [
            'can_view' => false,
            'can_edit' => false,
            'can_delete' => false,
            'access' => 0  // raw access to project
        ];

        // First of all extend by raw access value each
        $tasks_access = $this->getTasksAccess($tasks, $contact_ids);
        foreach ($tasks as &$task) {
            $collected_rights_info = array_fill_keys($contact_ids, $empty_rights);
            foreach ($contact_ids as $contact_id) {
                $collected_rights_info[$contact_id]['access'] = (int) ifset($tasks_access[$task['id']][$contact_id]);
            }
            $task['rights_info'] = $collected_rights_info;
        }
        unset($task);

        // For establish 'can_delete' we need for each contact fetch task counters of 'not own' log items
        // see below
        // [<contact_id>][<task_id>] = <count>
        $log_items_counters = [];

        // First pass through just for preparation before extracting auxiliary data
        foreach ($tasks as $task) {

            foreach ($contact_ids as $contact_id) {

                // interested in only in 'view_assigned' level of access
                if ($task['rights_info'][$contact_id]['access'] != self::PROJECT_ACCESS_VIEW_ASSIGNED_TASKS) {
                    continue;
                }

                if ($task['create_contact_id'] == $contact_id) {
                    // mark to extract counter for current task and contact
                    $log_items_counters[$contact_id][$task['id']] = 0;
                }
            }
        }

        // extract counters of 'not own' log items
        // 'not own' log item is item that item.contact_id != $contact_id
        foreach ($log_items_counters as $contact_id => &$contact_log_items_counters) {
            $task_ids = array_keys($contact_log_items_counters);
            $contact_log_items_counters = $this->getCountersOfNotOwnLogItems($contact_id, $task_ids);
        }
        unset($contact_log_items_counters);

        foreach ($tasks as &$task) {

            $collected_rights_info = $task['rights_info'];

            // main loop, for each contact calculate rights for current task
            foreach ($contact_ids as $contact_id) {

                $rights_info = &$collected_rights_info[$contact_id];

                if ($rights_info['access'] == self::PROJECT_ACCESS_FULL) {
                    $rights_info['can_edit'] = true;
                    $rights_info['can_delete'] = true;
                    $rights_info['can_view'] = true;
                    continue;
                }

                if ($rights_info['access'] == self::PROJECT_ACCESS_VIEW_ASSIGNED_TASKS) {

                    $is_assigned = $task['assigned_contact_id'] == $contact_id;
                    $is_author = $task['create_contact_id'] == $contact_id;

                    // establish 'can_delete':
                    // * author CAN delete
                    // * BUT if with this task already work other users ($counter > 0) author CAN NOT delete
                    $rights_info['can_delete'] = $is_author;
                    if ($rights_info['can_delete']) {
                        $counter = (int) ifset($log_items_counters[$contact_id][$task['id']]);
                        if ($counter > 0) {
                            $rights_info['can_delete'] = false;
                        }
                    }

                    // establish 'can_view'
                    $rights_info['can_view'] = $is_assigned || $is_author;

                    // establish 'can_edit'
                    $rights_info['can_edit'] = $is_author;

                    continue;
                }

            }

            $task['rights_info'] = $collected_rights_info;
        }
        unset($task);

        // if input function parameter $contact_id is scalar than not use indexing by contact ID
        // use pure 'rights_info' map
        if (is_scalar($input_contact_id)) {
            foreach ($tasks as &$task) {
                if (isset($task['rights_info'][$input_contact_id])) {
                    $task['rights_info'] = $task['rights_info'][$input_contact_id];
                } else {
                    // just in case
                    $task['rights_info'] = $empty_rights;
                }
            }
            unset($task);
        }

    }

    /**
     * @param array|tasksTask|int $task
     * @param int|waContact|null  $contact
     * @param array               $options
     *   'can_view_clarify' bool If need clarify can_view right
     *
     * @return bool
     */
    public function getTaskRightsInfo($task, $contact = null, $options = [])
    {
        $contact_id = $this->getContactId($contact);
        if ($contact_id === false) {
            return false;
        }

        if (wa_is_int($task)) {
            $tm = new tasksTaskModel();
            $task = $tm->getById($task);
            if (!$task) {
                return false;
            }
        }

        $tasks = [$task];
        $this->extendTasksByRightsInfo($tasks, $contact_id);
        $task = reset($tasks);
        $info = $task['rights_info'];

        $options = is_array($options) ? $options : [];
        $can_view_clarify = (bool) ifset($options['can_view_clarify']);

        // special case - can_view clarifying by checking last log item
        if (!$info['can_view'] && $info['access'] == self::PROJECT_ACCESS_VIEW_ASSIGNED_TASKS && $can_view_clarify) {
            if (!isset($task['log'])) {
                $lm = new tasksTaskLogModel();
                $log = $lm->getByTasks([$task['id'] => $task]);
                $task['log'] = isset($log[$task['id']]) ? $log[$task['id']] : [];
            }
            $log = $task['log'];
            $log_item = end($log);
            $log_item = $log_item ? $log_item : null;
            // author of last log item 'can_view' task
            if ($log_item && $log_item['contact_id'] == $contact_id) {
                $info['can_view'] = true;
            }
        }

        return $info;
    }

    protected function getContactId($contact = null)
    {
        if ($contact == null) {
            $contact = wa()->getUser()->getId();
        }

        if (wa_is_int($contact)) {
            return (int) $contact;
        }

        if (is_array($contact) && isset($contact['id'])) {
            return (int) $contact['id'];
        }

        if ($contact instanceof waContact) {
            return (int) $contact['id'];
        }

        return false;
    }

    /**
     * @param array|tasksTask|int $task
     * @param int|waContact|null  $contact
     * @param                     $clarify bool Extra checking for clarify right
     *
     * @return bool
     */
    public function canViewTask($task, $contact = null, $clarify = false)
    {
        $contact_id = $this->getContactId($contact);
        if ($contact_id === false) {
            return false;
        }
        $info = $this->getTaskRightsInfo($task, $contact, [
            'can_view_clarify' => $clarify,
        ]);

        return $info !== false && $info['can_view'];
    }

    /**
     * @param array|tasksTask|int $task
     * @param int|waContact|null  $contact
     *
     * @return bool
     */
    public function canEditTask($task, $contact = null)
    {
        $info = $this->getTaskRightsInfo($task, $contact);

        return $info !== false && $info['can_edit'];
    }

    /**
     * @param array|tasksTask|int $task
     * @param int|waContact|null  $contact
     *
     * @return bool
     */
    public function canDeleteTask($task, $contact = null)
    {
        $info = $this->getTaskRightsInfo($task, $contact);

        return $info !== false && $info['can_delete'];
    }

    /**
     * @param array|tasksTask|int $task
     * @param int|waContact|null  $contact
     *
     * @return bool
     */
    public function hasFullAccessToTask($task, $contact = null)
    {
        $info = $this->getTaskRightsInfo($task, $contact);

        return $info !== false && $info['access'] == self::PROJECT_ACCESS_FULL;
    }

    /**
     * Extend array of log items by information about rights to each log_item for each contact
     **
     *
     * @param array          $log_items  Array of DB-record (DB-record is also associative array: field => value)
     *                                   Each log_item MUST has field: 'id', 'text', 'action'
     *
     * Log items passed by &, so each log item will be modified - extended by
     *   array 'rights_info' - Rights info descriptor
     *     - bool 'can_edit' Can contact edit log_item?
     *     - bool 'can_delete' Can contact delete log_item?
     *
     * @param int|int[]|null $contact_id one or more contact IDs for which rights info will be defined
     *                                   If $contact_id IS NULL than get current user id
     */
    public function extendLogItemsByRightsInfo(&$log_items, $contact_id = null)
    {
        // Typecast IDs of contacts
        $contact_id = $contact_id === null ? wa()->getUser()->getId() : $contact_id;
        $contact_ids = tasksHelper::toIntArray($contact_id);
        $contact_ids = tasksHelper::dropNotPositive($contact_ids);
        $input_contact_id = $contact_id;

        if (!$log_items || !$contact_ids) {
            return;
        }

        // Typecast IDs of log_items
        $log_item_ids = waUtils::getFieldValues($log_items, 'id');
        $log_item_ids = tasksHelper::toIntArray($log_item_ids);
        $log_item_ids = tasksHelper::dropNotPositive($log_item_ids);
        if (!$log_item_ids) {
            return;
        }

        // Will need to check emptiness of log item
        // Log item is 'empty' when there is not text or any attachments
        $lm = new tasksTaskLogModel();
        $attachment_counters = $lm->countAttachments($log_item_ids);

        // Collect task IDs - cause rights of tasks matter also
        $task_ids = [];
        foreach ($log_items as $log_item) {
            $log_item_id = $log_item['id'];
            $attachment_count = (int) ifset($attachment_counters[$log_item_id]);
            $log_item_text = isset($log_item['text']) && is_scalar($log_item['text']) ? (string) $log_item['text'] : '';

            // For empty log_item not get task (and define rights for task) - a little bit optimization
            if (strlen($log_item_text) > 0 || $attachment_count > 0) {
                $task_ids[] = (int) $log_item['task_id'];
            }
        }

        // Get tasks and define tasks rights
        $hash = 'id/' . join(',', $task_ids);
        $col = new tasksCollection($hash);
        $tasks = $col->getTasks('*', 0, count($task_ids));
        $this->extendTasksByRightsInfo($tasks, $contact_ids);

        // Default empty right_info descriptor - for initial filling
        $empty_rights = [
            'can_edit' => false,
            'can_delete' => false,
        ];

        // TOP LEVEL MAIN LOOP
        // Visit each log item and define rights for each contact
        foreach ($log_items as &$log_item) {

            $log_item_id = $log_item['id'];
            $attachment_count = (int) ifset($attachment_counters[$log_item_id]);

            // here is collected rights for each contact ID
            // Initial filling with default empty right_info descriptor
            $collected_rights_info = array_fill_keys($contact_ids, $empty_rights);

            // second level main loop
            // for each contact calculate rights for current log item
            foreach ($contact_ids as $contact_id) {

                // right_info descriptor for concrete log_item AND contact
                // & - just for shortcut
                $rights_info = &$collected_rights_info[$contact_id];

                $is_comment = $log_item['action'] == tasksTaskLogModel::ACTION_TYPE_COMMENT;
                $log_item_text = isset($log_item['text']) && is_scalar(
                    $log_item['text']
                ) ? (string) $log_item['text'] : '';

                // 'empty' COMMENT must be allowed to be deleted
                // 'empty' log item - skip - isn't editable, isn't deletable
                if (strlen($log_item_text) <= 0 && $attachment_count <= 0) {
                    $rights_info['can_delete'] = $is_comment;
                    continue;
                }

                // No task - no rights
                $task_id = $log_item['task_id'];
                if (!isset($tasks[$task_id])) {
                    continue;
                }

                // No task rights for contact - not rights for comment
                $task = $tasks[$task_id];
                if (!isset($task['rights_info'][$contact_id])) {
                    continue;
                }

                // Contact can't view tasks than also can't rights to comment
                if (!$task['rights_info'][$contact_id]['can_view']) {
                    continue;
                }

                // Log item can COMMENT or NOT
                // NOT COMMENT it's technical log_item - NOT clever to delete it
                // So not comment log item is always not DELETABLE

                // Full access to task -
                // Any log item can edit
                // Only comment can delete
                if ($task['rights_info'][$contact_id]['access'] == self::PROJECT_ACCESS_FULL) {
                    $rights_info['can_edit'] = true;
                    $rights_info['can_delete'] = $is_comment;
                    continue;
                }

                // Can view assigned task case
                // Only own log item can edit
                // Only own comment can delete
                if ($task['rights_info'][$contact_id]['access'] == self::PROJECT_ACCESS_VIEW_ASSIGNED_TASKS) {
                    $rights_info['can_edit'] = $log_item['contact_id'] == $contact_id;
                    $rights_info['can_delete'] = $rights_info['can_edit'] && $is_comment;
                    continue;
                }
            }

            // save rights info for current log item
            $log_item['rights_info'] = $collected_rights_info;

            // if input function parameter $contact_id is scalar than not use indexing by contact ID
            if (is_scalar($input_contact_id)) {
                if (isset($log_item['rights_info'][$input_contact_id])) {
                    $log_item['rights_info'] = $log_item['rights_info'][$input_contact_id];
                } else {
                    // just in case
                    $log_item['rights_info'] = $empty_rights;
                }
            }

        }
        unset($log_item);

    }

    /**
     * @param int|array          $log_item ID or DB record of comment
     * @param int|waContact|null $contact
     *
     * @return mixed
     */
    public function getLogItemRightsInfo($log_item, $contact = null)
    {
        $contact_id = $this->getContactId($contact);
        if ($contact_id === false) {
            return false;
        }

        if (wa_is_int($log_item)) {
            $lm = new tasksTaskLogModel();
            $log_item = $lm->getById($log_item);
            if (!$log_item) {
                return false;
            }
        }

        $log_items = [$log_item];
        $this->extendLogItemsByRightsInfo($log_items, $contact_id);
        $log_item = reset($log_items);

        return $log_item['rights_info'];
    }

    /**
     * @param int|array          $log_item ID or DB record of comment
     * @param int|waContact|null $contact
     *
     * @return mixed
     */
    public function canEditLogItem($log_item, $contact = null)
    {
        $rights_info = $this->getLogItemRightsInfo($log_item, $contact);

        return $rights_info !== false && $rights_info['can_edit'];
    }

    /**
     * @param int|array          $log_item ID or DB record of comment
     * @param int|waContact|null $contact
     *
     * @return mixed
     */
    public function canDeleteLogItem($log_item, $contact = null)
    {
        $rights_info = $this->getLogItemRightsInfo($log_item, $contact);

        return $rights_info !== false && $rights_info['can_delete'];
    }

    protected function getTasksAccess($tasks, $contact_ids)
    {
        if (!$tasks || !$contact_ids) {
            return;
        }
        $project_ids = [];
        foreach ($tasks as $task) {
            $project_ids[] = $task['project_id'];
        }
        $project_ids = array_unique($project_ids);

        $access_map = [];
        foreach ($contact_ids as $contact_id) {
            $contact = new waContact($contact_id);
            foreach ($project_ids as $project_id) {
                $access = $contact->getRights('tasks', 'project.' . $project_id);
                $access_map[$contact_id][$project_id] = $access;
            }
        }

        $tasks_access_map = [];
        foreach ($tasks as $task) {
            $project_id = $task['project_id'];
            foreach ($contact_ids as $contact_id) {
                $access = self::PROJECT_ACCESS_NONE;
                if (isset($access_map[$contact_id][$project_id])) {
                    $access = $access_map[$contact_id][$project_id];
                    if ($access >= self::PROJECT_ACCESS_FULL) {
                        $access = self::PROJECT_ACCESS_FULL;
                    }
                }
                $tasks_access_map[$task['id']][$contact_id] = $access;
            }
        }

        return $tasks_access_map;
    }

    public function contactHasAccessToProject(waContact $contact, $projectId): bool
    {
        return $contact->getRights('tasks', 'project.' . $projectId) > 0;
    }

    public function getAvailableProjectForContact(waContact $contact)
    {
        $allRights = $contact->getRights('tasks', null, false);

        if ($allRights[tasksRightConfig::RIGHT_NAME_BACKEND] >= tasksRightConfig::RIGHT_BACKEND_FULL) {
            return true;
        }

        $access = array_reduce(
            array_keys($allRights),
            static function ($projectIds, $rightKey) use ($allRights) {
                $rightExploded = explode('.', $rightKey);

                if (count($rightExploded) !== 2) {
                    return $projectIds;
                }

                if ($rightExploded[0] !== tasksRightConfig::RIGHT_NAME_PROJECT) {
                    return $projectIds;
                }

                if ($rightExploded[1] === 'all') {
                    return $projectIds;
                }

                $projectIds[$allRights[$rightKey]][] = (int) $rightExploded[1];

                return $projectIds;
            },
            [
                self::PROJECT_ACCESS_VIEW_ASSIGNED_TASKS => [],
                self::PROJECT_ACCESS_FULL => [],
                self::PROJECT_ANY_ACCESS => [],
            ]
        );

        $access[self::PROJECT_ANY_ACCESS] = array_merge(
            $access[self::PROJECT_ACCESS_VIEW_ASSIGNED_TASKS],
            $access[self::PROJECT_ACCESS_FULL]
        );

        return $access;
    }

    protected function getCountersOfNotOwnLogItems($contact_id, $task_ids)
    {
        $task_ids = tasksHelper::toIntArray($task_ids);
        $task_ids = tasksHelper::dropNotPositive($task_ids);
        $contact_id = (int) $contact_id;
        if (!$task_ids || !$contact_id) {
            return 0;
        }
        $m = new waModel();
        $counters = array_fill_keys($task_ids, 0);
        $sql = "SELECT `task_id`, COUNT(*) AS `count` 
                      FROM `tasks_task_log` 
                      WHERE `task_id` IN (:task_ids) AND `contact_id` != :contact_id
                      GROUP BY `task_id`";
        $result = $m->query($sql, [
            'task_ids' => $task_ids,
            'contact_id' => $contact_id,
        ])->fetchAll();
        foreach ($result as $item) {
            $counters[$item['task_id']] = $item['count'];
        }

        return $counters;
    }
}
