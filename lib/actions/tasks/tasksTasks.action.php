<?php

/**
 * All kinds of task lists as HTML.
 */
class tasksTasksAction extends waViewAction
{
    public function execute()
    {
        $hash = waRequest::get('hash', '', waRequest::TYPE_STRING);
        $filters = waRequest::get('filters', '', waRequest::TYPE_STRING);
        $offset = waRequest::get('offset', 0, waRequest::TYPE_INT);
        $limit = tasksOptions::getTasksPerPage();
        $since = waRequest::request('since', null, waRequest::TYPE_INT);
        $order = wa()->getRequest()->get('order', '', waRequest::TYPE_STRING_TRIM);
        $listId = wa()->getRequest()->get('list_id', 0, waRequest::TYPE_INT);

        $hash = urldecode($hash);

        $c = new tasksCollection($hash);
        $collection_info = $c->getInfo();
        $this->applyFilters($c, $filters);
        $this->applySince($c, $since);

        $list = $this->getList($listId, $hash, $filters, $order, $c);

        $order = $this->getOrder($c, $order, $filters, $list);

        $this->applyOrder($c, $order);

        $total_count = null;
        $task_rows = $c->getTasks(
            tasksCollection::FIELDS_TO_GET,
            $offset,
            $limit,
            $total_count
        );

//        if ($c->getType() == 'search') {
//            $task_rows = (new tasksSearchService())->extend($task_rows, $c->getInfo());
//        }

        $tasks = [];
        $logs_by_task = [];
        foreach ($task_rows as $t) {
            $tasks[$t['id']] = new tasksTask($t);
            if (!empty($t['log'])) {
                $logs_by_task[$t['id']] = $t['log'];
            }
        }
        unset($task_rows);
        $count = count($tasks);

        wa('tasks')->event('tasks_log', $logs_by_task);
        foreach ($logs_by_task as $task_id => $log) {
            $tasks[$task_id]['log'] = $log;
        }
        unset($logs_by_task);

        $search_value = '';
        if ($c->getType() === tasksCollection::HASH_SEARCH) {
            $search_value = $collection_info;
        }

        // prepare tasks for view
        tasksHelper::workupTasksForView($tasks);

        // hook jukebox
        $backend_tasks_hooks = $this->triggerBackendTasksEvent(
            $tasks,
            [
                'hash' => $hash,
                'filters' => $filters,
                'order' => $order,
            ]
        );

        $project_id = null;
        if ($c->getType() === tasksCollection::HASH_PROJECT && !empty($collection_info['id'])) {
            $project_id = $collection_info['id'];
        }

        $scopeId = null;
        if ($c->getType() === tasksCollection::HASH_SCOPE && !empty($collection_info['id'])) {
            $scopeId = $collection_info['id'];

            $milestone = tsks()->getEntityRepository(tasksMilestone::class)
                ->findById($scopeId);
        }

        $this->view->assign(
            [
                'hash_type' => $c->getType(),
                'count' => $count,
                'offset' => $offset,
                'total_count' => $total_count,
                'search_value' => $search_value,
                'click_to_load_more' => $offset > 100,
                'next_page_url' => self::getNextPageUrl($offset, $limit, $count, $total_count),
                'filter_types' => self::getFilterTypes($project_id, $hash),
                'emptymsg' => self::getEmptyMsg($c->getType(), $collection_info, $filters),
                'updater_url' => self::getUpdaterUrl($c, $tasks, $total_count),
                'no_filters_hash' => '#/tasks/' . trim($hash, '\/') . '/',
                'list_view_type' => self::getListViewType(),
                'is_filter_set' => !!$filters,
                'current_sort' => $order,
                'tasks' => $tasks,
                'hash' => $hash,
                'parsed_hash' => $c->getHash(),
                'list' => $list,
                'backend_tasks_hooks' => $backend_tasks_hooks,
                'tags_cloud' => self::getTagsCloud($project_id),
                'statuses' => self::getStatusFilterType(),

                'show_settings' => wa()->getUser()->isAdmin('tasks') && in_array(
                        $c->getType(),
                        [tasksCollection::HASH_PROJECT, tasksCollection::HASH_SCOPE],
                        true
                    ),
                'settings_url' => $project_id
                    ? "project/$project_id/"
                    : ($scopeId ? "scope/$scopeId/" : ''),

                'milestone' => $milestone ?? null,
            ]
        );
    }

    protected function applyFilters(tasksCollection $c, $filters): void
    {
        $filters && $c->filter($filters);
        $type = $c->getType();
        if (!in_array($type,
                [
                    tasksCollection::HASH_SEARCH,
                    tasksCollection::HASH_OUTBOX,
                    tasksCollection::HASH_STATUS,
                    tasksCollection::HASH_ID,
                    tasksCollection::HASH_TAG
                ],
                true
            ) && (strpos($filters, 'status_id') === false)
        ) {
            $c->addWhere('t.status_id >= 0');
        }
    }

    protected function applySince(tasksCollection $c, $since): void
    {
        $since && $c->addWhere("t.update_datetime > '" . date('Y-m-d H:i:s', $since) . "'");
    }

    protected function applyOrder(tasksCollection $c, $order): void
    {
        switch ($order) {
            case tasksCollection::ORDER_NEWEST:
                $c->orderBy('update_datetime', 'DESC');
                break;

            case tasksCollection::ORDER_OLDEST:
                $c->orderBy('update_datetime');
                break;

            case tasksCollection::ORDER_DUE:
                $c->orderByDue();
                break;

            case tasksCollection::ORDER_PRIORITY:
            default:
                break; // Nothing to do: collection defaults to priority ordering
        }
    }

    protected function getList($listId, $hash, $filters, $order, tasksCollection $c): ?array
    {
        $lm = new tasksListModel();

        $list = null;
        if ($listId > 0) {
            $list = $lm->getById($listId);
            $lm->updateCountByCollection($listId, $c);
            if ($list) {
                $list['found_by_id'] = true;
            }
        }
        if (!$list) {
            $list = $lm->findOne($hash, $filters, $order);
        }
        if ($list) {
            $list['is_own'] = $list['contact_id'] == $this->getUserId();
        }
        if ($list && !isset($list['found_by_id'])) {
            $list['found_by_id'] = false;
        }

        return $list;
    }

    /**
     * Trigger 'backend_tasks' event
     * See doc comments in method body
     *
     * @param $tasks
     * @param $params
     *
     * @return array
     */
    protected function triggerBackendTasksEvent(&$tasks, $params)
    {
        /**
         * UI hook for extend task list page:
         *
         * 1) extend each task html block as like as in 'backend_task' event
         * 2) extend other page blocks, like filters block in header of page
         *
         *
         * @event backend_tasks
         *
         * @param int[]|array[]|tasksTask[] $tasks
         * @param string                    $hash
         * @param string                    $filters
         * @param string                    $order
         *
         * Returns complex structure
         *
         * In key 'tasks' returns html blocks for each tasks
         *
         * @return array[string]array $return[%plugin_id%]['tasks'][%task_id%] array of array of html output
         *
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['before_header'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['header'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['after_header'] html
         *
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['before_description'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['description'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['after_description'] html
         *
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['before_attachments'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['attachments'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['after_attachments'] html
         *
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['before_quote_header'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['quote_header'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['after_quote_attachments'] html
         *
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['before_quote_description'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['quote_description'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['after_quote_description'] html
         *
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['before_quote_attachments'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['quote_attachments'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['after_quote_attachments'] html
         *
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['before_buttons'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['buttons'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['after_buttons'] html
         *
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['before_hidden_block'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['hidden_block'] html
         * @return string $return[%plugin_id%]['tasks'][%task_id%]['after_hidden_block'] html
         *
         * In other keys returns html blocks for whole tasks page
         *
         * @return array $return[%plugin_id%]['header'] html blocks in header of page
         *
         * @return string $return[%plugin_id%]['header']['top'] html block in top of header
         * @return string $return[%plugin_id%]['header']['filters'] array of html blocks, each is filter html block
         * @return string $return[%plugin_id%]['header']['preview'] html in preview section
         * @return string $return[%plugin_id%]['header']['toolbar'] html in toolbar section
         * @return string $return[%plugin_id%]['header']['bottom'] html in bottom of header
         *
         * @return string[] $return[%plugin_id%]['header']['order_items'] array of items for extend order menu
         * @return string $return[%plugin_id%]['header']['order_items'][%index%]['id'] unique ID of item
         * @return string $return[%plugin_id%]['header']['order_items'][%index%]['name'] name of item
         *
         * @return string $return[%plugin_id%]['header']['bulk'] html in bulk panel
         *
         * @return array $return[%plugin_id%]['body'] html blocks in body of page
         * @return string $return[%plugin_id%]['body']['top'] html in top of body
         * @return string $return[%plugin_id%]['body']['bottom'] html in bottom of body
         */
        $params['tasks'] = $tasks;

        $backend_tasks_result = wa()->event('backend_tasks', $params);

        foreach ($tasks as &$task) {
            $hooks = [
                'backend_task' => [],
            ];
            foreach ($backend_tasks_result as $plugin_id => $backend_tasks) {
                $hooks['backend_task'][$plugin_id] = [];
                $backend_tasks['tasks'] = isset($backend_tasks['tasks']) && is_array(
                    $backend_tasks['tasks']
                ) ? $backend_tasks['tasks'] : [];
                if (isset($backend_tasks['tasks'][$task['id']])) {
                    $hooks['backend_task'][$plugin_id] = $backend_tasks['tasks'][$task['id']];
                }
            }
            $task['hooks'] = $hooks;

        }
        unset($task);

        $page_hooks = [];
        foreach ($backend_tasks_result as $plugin_id => $backend_tasks) {
            foreach ($backend_tasks as $key => $result) {
                if ($key !== 'tasks') {
                    $page_hooks[$key][$plugin_id] = $result;
                }
            }
        }

        return $page_hooks;
    }

    protected static function getFilterTypes($project_id, $hash = null): array
    {
        $filter_types['project_id'] = [
            'id' => 'project_id',
            'hash' => 'project',
            'options' => self::getProjectFilterType($hash),
        ];
        $filter_types['milestone_id'] = [
            'id' => 'milestone_id',
            'hash' => 'scope',
            'options' => self::getMilestoneFilterType(),
        ];

        if ($hash !== 'inbox') {
            $filter_types['assigned_contact_id'] = [
                'id' => 'assigned_contact_id',
                'hash' => 'assigned',
                'options' => self::getUsersFilterType($project_id),
            ];
        } else {
            $filter_types['from_contact_id'] = [
                'id' => 'from_contact_id',
                'options' => self::getUsersFilterType($project_id),
            ];
            $filter_types['from_contact_id']['options']['']['name'] = _w('All senders');
        }

        $filter_types['status_id'] = [
            'id' => 'status_id',
            'hash' => 'status',
            'options' => self::getStatusFilterType($project_id),
        ];

        return $filter_types;
    }

    protected static function getProjectFilterType($hash = null): array
    {
        $project_model = new tasksProjectModel();

        $all_projects = tasksHelper::extendIcon($project_model->getEmptyRow());
        $all_projects['name'] = _w('All projects');

        $project_items = tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray();

        // mark each project item by flag 'is_empty',
        // that means are there tasks in project assigned to current user
        if ($hash === 'inbox' && $project_items) {
            $project_ids = waUtils::getFieldValues($project_items, 'id');
            $sql = "SELECT DISTINCT `project_id`
                    FROM `tasks_task`
                    WHERE `project_id` IN (:project_ids) AND `assigned_contact_id` = :contact_id AND `status_id` != -1";
            $result = $project_model->query(
                $sql,
                [
                    'project_ids' => $project_ids,
                    'contact_id' => wa()->getUser()->getId(),
                ]
            )->fetchAll('project_id');
            foreach ($project_items as &$item) {
                $item['is_empty'] = !isset($result[$item['id']]);
            }
            unset($item);
        }

        return ['' => $all_projects] + $project_items;
    }

    protected static function getStatusFilterType($project_id = null): array
    {
        $status_model = new tasksStatusModel();

        $all_statuses = tasksHelper::extendIcon($status_model->getEmptyRow());
        $all_statuses['name'] = _w('All open');

        $all_statuses_without_archive = tasksHelper::extendIcon($status_model->getEmptyRow());
        $all_statuses_without_archive['name'] = _w('All including closed');
        $all_statuses_without_archive['id'] = 'all';

        return [
                '' => $all_statuses,
            ]
            + tasksHelper::getStatuses($project_id)
            + ['all' => $all_statuses_without_archive];
    }

    protected static function getMilestoneFilterType(): array
    {
        $milestone_model = new tasksMilestoneModel();
        $milestones = $milestone_model->getMilestonesWithOrder(false);

        return [
                '' => [
                    'id' => '',
                    'name' => _w('All milestones'),
                    'project_id' => '',
                ],
                '0' => [
                    'id' => 'NULL',
                    'op' => '==',
                    'name' => _w('No milestone'),
                    'project_id' => '',
                ],
            ] + $milestones;
    }

    protected static function getUsersFilterType($project_id)
    {
        return [
                '' => [
                    'id' => '',
                    'name' => _w('All assignees'),
                    'photo' => '',
                ],
            ] + tasksHelper::getTeam($project_id);
    }

    protected static function getListViewType()
    {
        $type = waRequest::get('view', '', 'string');
        if (!in_array($type, ['detailed', 'table'])) {
            $type = 'detailed';
        }

        return $type;
    }

    protected static function getEmptyMsg($type, $info, $filters): array
    {
        if (!$filters) {
            if ($type === tasksCollection::HASH_INBOX) {
                return [
                    'name' => 'me-assigned',
                    'title' => _w('Your inbox is empty'),
                    'message' => _w(
                        'Inbox automatically collects all tasks assigned to you. No tasks are assigned to you right now :-)'
                    ),
                    'img_url' => wa()->getAppStaticUrl('tasks') . 'img/notice/welcome.png',
                ];
            }

            if ($type === tasksCollection::HASH_ASSIGNED && $info) {
                if ($info['id'] == wa()->getUser()->getId()) {
                    return [
                        'name' => 'me-assigned',
                        'title' => _w('Your inbox is empty'),
                        'message' => _w(
                            'Inbox automatically collects all tasks assigned to you. No tasks are assigned to you right now :-)'
                        ),
                        'img_url' => wa()->getAppStaticUrl('tasks') . 'img/notice/welcome.png',
                    ];
                }

                $c = new waContact($info);

                return [
                    'name' => 'user-assigned',
                    'title' => sprintf_wp("%s's task list is empty", htmlspecialchars($c->getName())),
                    'message' => sprintf_wp(
                        wa()->getUser()->isAdmin('tasks') ? 'Involve %s to the teamwork just by sending a new task.' : 'There are no task assigned to %s in projects you collaborate on together.',
                        htmlspecialchars($c->getName())
                    ),
                    //'img_url' => $c->getPhoto(192, 192),
                    'img_url' => wa()->getAppStaticUrl('tasks') . 'img/notice/welcome.png',
                ];
            }

            if ($type === tasksCollection::HASH_OUTBOX) {
                return [
                    'name' => 'outbox',
                    'title' => _w('Your outbox is empty'),
                    'message' => _w('Outbox automatically collects all tasks you’ve created.'),
                    'img_url' => wa()->getAppStaticUrl('tasks') . 'img/notice/outbox.png',
                ];
            }

            if ($type === tasksCollection::HASH_FAVORITES) {
                return [
                    'name' => 'favorites',
                    'title' => _w('Your favorite task list is empty'),
                    'message' => _w(
                        'To add a task to your personal favorite list, click on a tiny star icon next to task name.'
                    ),
                    'img_url' => wa()->getAppStaticUrl('tasks') . 'img/notice/favorite.png',
                ];
            }

            if ($type === tasksCollection::HASH_PROJECT && $info) {
                return [
                    'name' => 'project',
                    'title' => sprintf_wp("No tasks in %s project", htmlspecialchars($info['name'])),
                    'message' => wa()->getUser()->isAdmin('tasks') ? _w('Use projects to organize tasks and manage access rights for your teammates.') : _w('There are no tasks in this project that require your attention at the moment. If you think its by mistake, ask the account admin to check your access rights.'),
                    'img_url' => wa()->getAppStaticUrl('tasks') . 'img/notice/welcome.png',
                ];
            }

            if ($type === tasksCollection::HASH_STATUS && $info) {
                return [
                    'name' => 'status',
                    'title' => sprintf_wp("No tasks in %s status", htmlspecialchars($info['name'])),
                    'message' => sprintf_wp(
                        'There are currently no tasks in %s status.',
                        htmlspecialchars($info['name'])
                    ),
                    'img_url' => wa()->getAppStaticUrl('tasks') . 'img/notice/welcome.png',
                ];
            }
        }

        return [
            'name' => 'all',
            'title' => _w('Task list is empty'),
            'message' => _w('No tasks match your search criteria.'),
            'img_url' => wa()->getAppStaticUrl('tasks') . 'img/notice/welcome.png',
        ];
    }

    protected static function getNextPageUrl($offset, $limit, $count, $total_count): string
    {
        if ($offset + $count >= $total_count) {
            return '';
        }
        $params = waRequest::get();
        $params['offset'] = ifset($params['offset'], 0) + $limit;
        unset($params['since']);

        return '?' . http_build_query($params);
    }

    protected static function getUpdaterUrl($collection, $tasks, $total_count): string
    {
        if ($collection->getType() !== tasksCollection::HASH_INBOX) {
            return '';
        }
        $params = waRequest::get();
        $params['since'] = self::getLastUpdateTime($collection, $tasks, $total_count);

        return '?' . http_build_query($params);
    }

    protected static function getLastUpdateTime($collection, $tasks, $total_count)
    {
        if ($total_count == count($tasks)) {
            $max_ts = 0;
            foreach ($tasks as $t) {
                $ts = strtotime($t['update_datetime']);
                if ($ts > $max_ts) {
                    $max_ts = $ts;
                }
            }

            return $max_ts;
        }

        return $collection->getLastUpdateTime();
    }

    protected function getOrder(tasksCollection $collection, $order, $filters, ?array $list): string
    {
        $order = is_scalar($order) ? (string) $order : '';

        // только своих сохраненных фильтров отдельно сбережем сортировку
        if (!isset($list['is_own'])) {
            $filters = '';
        }

        if ($order === '') {
            $order = $this->getSavedOrder($collection, $filters);
        }
        if ($order === '') {
            $order = $this->getDefaultOrder($collection);
        }

        $this->saveOrder($collection, $order, $filters);

        return $order;
    }

    protected function saveOrder(tasksCollection $collection, $order, $filters): void
    {
        $key = $this->getOrderKey($collection, $filters);
        $order = is_scalar($order) ? (string) $order : '';
        $csm = new waContactSettingsModel();
        if ($order === '' || $order === $this->getDefaultOrder($collection)) {
            $csm->delete($this->getUserId(), $this->getAppId(), $key);
        } else {
            $csm->set($this->getUserId(), $this->getAppId(), $key, $order);
        }
    }

    protected function getSavedOrder(tasksCollection $collection, $filters): string
    {
        $key = $this->getOrderKey($collection, $filters);
        $csm = new waContactSettingsModel();
        $order = $csm->getOne($this->getUserId(), $this->getAppId(), $key);

        return is_scalar($order) ? (string) $order : '';
    }

    protected function getDefaultOrder(tasksCollection $collection)
    {
        $type = $collection->getType();
        $info = $collection->getInfo();
        if ($type === tasksCollection::HASH_OUTBOX) {
            $order = tasksCollection::ORDER_OLDEST;
        } elseif ($type === tasksCollection::HASH_STATUS && $info['id'] == tasksStatusModel::STATUS_CLOSED_ID) {
            $order = tasksCollection::ORDER_NEWEST;
        } else {
            $order = tasksCollection::ORDER_PRIORITY;
        }

        return $order;
    }

    protected function getOrderKey(tasksCollection $collection, string $filters): string
    {
        $type = $collection->getType();
        if ($type !== tasksCollection::HASH_STATUS) {
            if ($filters) {
                return sprintf("tasks/tasks_order/%s/%s", $type, md5($filters));
            }

            return sprintf("tasks/tasks_order/%s", $type);
        }

        $info = $collection->getInfo();

        return sprintf("tasks/tasks_order/%s/%s", $type, $info['id']);
    }

    protected static function getTagsCloud($project_id = null): ?array
    {
        $tasks_tags_model = new tasksTaskTagsModel();

        return $tasks_tags_model->getCloud($project_id);
    }
}
