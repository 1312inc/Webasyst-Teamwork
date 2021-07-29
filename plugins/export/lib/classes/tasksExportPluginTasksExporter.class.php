<?php

class tasksExportPluginTasksExporter
{
    /**
     * @var array
     */
    protected $options;

    /**
     * @var string
     */
    protected $process_id;

    /**
     * @var array
     */
    protected $vars = array();

    /**
     * @var waCache
     */
    protected static $cache;

    public function __construct($options = array())
    {
        if (isset($options['process_id'])) {
            $this->process_id = $options['process_id'];
            unset($options['process_id']);
        } else {
            $this->process_id = uniqid(get_class($this), true);
        }
        if (isset($options['hash'])) {
            $this->setHash($options['hash']);
        }
        if (isset($options['filters'])) {
            $this->setFilters($options['filters']);
        }
        if (isset($options['order'])) {
            $this->setOrder($options['order']);
        }
        $this->options = $options;
    }

    /**
     * @return string
     */
    public function getProcessId()
    {
        return $this->process_id;
    }

    /**
     * @param int $chunk_size
     * @return bool Done or not
     */
    public function exportChunk($chunk_size = 100)
    {
        if ($this->isExportDone()) {
            return true;
        }

        $options['check_rights'] = isset($this->options['check_rights']) ? $this->options['check_rights'] : true;
        $collection = new tasksCollection($this->getHash(), $options);
        $this->applyFilters($collection, $this->getFilters());
        $this->applyOrder($collection, $this->getOrder());

        $offset = $this->getOffset();
        $tasks = $collection->getTasks('*', $offset, $chunk_size);
        $this->workupTasks($tasks);

        $result = $this->exportTasks($tasks);

        $this->saveResultChunk($result);

        $offset += count($tasks);
        $this->setOffset($offset);

        if ($offset >= $collection->count()) {
            $this->markExportAsDone();
            return true;
        }
        return false;
    }

    /**
     * @param int $chunk_size
     * @return array
     */
    public function getExportResultChunk($chunk_size = 100)
    {
        $data = array();

        $result = $this->getSavedResult();
        if (!$result || $this->isExportResultGettingDone()) {
            return array();
        }

        $not_export_empty_columns = (bool)ifset($this->options['not_export_empty_columns']);
        $not_export_column_names  = (bool)ifset($this->options['not_export_column_names']);

        if (!$not_export_column_names && !$this->isFieldsReceived()) {
            $line = array();
            foreach ($result as $field_id => $res) {
                $line[$field_id] = $res['name'];
            }
            $data['fields'] = $line;
            $this->markFieldsAsReceived();
            $chunk_size -= 1;
        }

        if ($chunk_size <= 0) {
            return $data;
        }

        foreach ($result as $field_id => &$res) {
            $line_i = 0;
            foreach ($res['data'] as $task_id => $value) {
                $is_empty_column = ifset($res['is_empty_column']);
                if (!$not_export_empty_columns || !$is_empty_column) {
                    $data[$task_id][$field_id] = $value;
                }
                unset($res['data'][$task_id]);

                $line_i += 1;
                if ($line_i >= $chunk_size) {
                    break;
                }
            }
        }
        unset($res);

        $data_count = count($data);
        $not_data = $data_count <= 0;
        $only_fields = $data_count === 1 && key($data) === 'fields';
        if ($chunk_size > 0 && ($not_data || $only_fields)) {
            $this->markExportResultGettingAsDone();
            return array();
        }

        $this->setCacheVar('result', $result, true);

        return $data;
    }

    protected function applyFilters(tasksCollection $c, $filters)
    {
        $filters && $c->filter($filters);
        $type = $c->getType();
        if (!in_array($type, array('search', 'outbox', 'status')) && (strpos($filters, 'status_id') === false)) {
            $c->addWhere('t.status_id >= 0');
        }
    }

    protected function applyOrder(tasksCollection $c, $order)
    {
        switch($order) {
            case 'newest':
                $c->orderBy('update_datetime', 'DESC');
                break;
            case 'oldest':
                $c->orderBy('create_datetime');
                break;
            case 'due':
                $c->orderByDue();
                break;
            case 'priority':
            default:
                break; // Nothing to do: collection defaults to priority ordering
        }
    }

    protected function workupTasks(&$tasks)
    {
        // TODO: check rights to task (project)

        $contact_ids = array();
        $contact_ids = array_merge($contact_ids, waUtils::getFieldValues($tasks, 'create_contact_id'));
        $contact_ids = array_merge($contact_ids, waUtils::getFieldValues($tasks, 'assigned_contact_id'));
        $contact_ids = array_merge($contact_ids, waUtils::getFieldValues($tasks, 'contact_id'));

        $cm = new waContactModel();
        $contact_names = $cm->getName($contact_ids);

        $milestone_ids = waUtils::getFieldValues($tasks, 'milestone_id');
        $milestone_names = $this->loadMilestoneNames($milestone_ids);

        $project_ids = waUtils::getFieldValues($tasks, 'project_id');
        $project_names = $this->loadProjectNames($project_ids);

        $statuses = tasksHelper::getStatuses();
        $status_names = waUtils::getFieldValues($statuses, 'name');

        $priorities = (array)wa('tasks')->getConfig()->getOption('priorities');
        $priority_names = waUtils::getFieldValues($priorities, 'name', true);
        foreach ($priority_names as &$priority_name) {
            $priority_name = _w($priority_name);
        }
        unset($priority_name);

        $task_ids = waUtils::getFieldValues($tasks, 'id');
        $plugin_releases_data = $this->loadPluginReleasesData($task_ids);

        foreach ($tasks as &$task) {
            $task['data'] = array();
            $task['data']['name'] = strlen((string)$task['name']) > 0 ? (string)$task['name'] : _w('(no name)');

            $task['data']['creator_name'] = $this->getArVal($contact_names, $task['create_contact_id'], $task['create_contact_id']);
            $task['data']['assigned_name'] = $this->getArVal($contact_names, $task['assigned_contact_id'], $task['assigned_contact_id']);
            $task['data']['contact_name'] = $this->getArVal($contact_names, $task['contact_id'], $task['contact_id']);

            if ($task['milestone_id']) {
                $task['data']['milestone_name'] = $this->getArVal($milestone_names, $task['milestone_id'], $task['milestone_id']);
            } else {
                $task['data']['milestone_name'] = 'Без срока';
            }

            $task['data']['project_name'] = $this->getArVal($project_names, $task['project_id'], $task['project_id']);
            $task['data']['number'] = $task['project_id'] . '.' . $task['number'];
            $task['data']['status_name'] = $this->getArVal($status_names, $task['status_id'], $task['status_id']);
            $task['data']['priority_name'] = $this->getArVal($priority_names, $task['priority'], $task['priority']);

            foreach ($plugin_releases_data[$task['id']] as $field_id => $value) {
                $task['data']["plugin_releases_{$field_id}"] = $value;
            }
        }
        unset($task);
    }

    protected function getArVal($ar, $key, $default)
    {
        return array_key_exists($key, $ar) ? $ar[$key] : $default;
    }

    protected function loadProjectNames($project_ids)
    {
        if (!$project_ids) {
            return array();
        }
        $pm = new tasksProjectModel();
        return $pm->select('id, name')->where('id IN (:ids)', array(
            'ids' => array_unique($project_ids)
        ))->fetchAll('id', true);
    }

    protected function loadMilestoneNames($milestone_ids)
    {
        if (!$milestone_ids) {
            return array();
        }
        $mm = new tasksMilestoneModel();
        return $mm->select('id, name')->where('id IN (:ids)', array(
            'ids' => array_unique($milestone_ids)
        ))->fetchAll('id', true);
    }

    protected function loadPluginReleasesData($ids)
    {
        $data = array_fill_keys($ids, array());
        if (!$ids || !$this->isReleasesOn()) {
            return $data;
        }

        $model = new tasksReleasesPluginTaskExtModel();
        foreach ($model->getByField('task_id', $ids, 'task_id') as $id => $item) {
            $data[$id] = $item;
        }

        $empty = $model->getEmptyRow();
        foreach ($data as $id => &$item) {
            if (!$item) {
                $item = $empty;
            }
        }
        unset($item);

        $types = tasksReleasesPluginTaskExtModel::getTypes();
        $gravities = tasksReleasesPluginTaskExtModel::getGravities();
        $resolutions = tasksReleasesPluginTaskExtModel::getResolutions();

        foreach ($data as $task_id => &$item) {
            $item['type_name'] = $this->getArVal($types, $item['type'], '');
            $item['gravity_name'] = $this->getArVal($gravities, $item['gravity'], '');
            $item['resolution_name'] = $this->getArVal($resolutions, $item['resolution'], '');
            unset($item['type'], $item['gravity'], $item['resolution']);
        }
        unset($item);

        return $data;

    }

    protected function exportTasks($tasks)
    {
        $fields = $this->getFields();

        $result = array();
        foreach ($fields as $field_id => $name) {
            $result[$field_id] = array(
                'name' => $name,
                'data' => array()
            );
        }

        foreach ($tasks as $task) {
            foreach ($fields as $field_id => $field_name) {
                if (array_key_exists($field_id, $task['data'])) {
                    $result[$field_id]['data'][$task['id']] = (string)$task['data'][$field_id];
                } elseif (array_key_exists($field_id, $task)) {
                    $result[$field_id]['data'][$task['id']] = (string)$task[$field_id];
                } else {
                    $result[$field_id]['data'][$task['id']] = '';
                }
            }
        }

        return $result;
    }

    protected function isReleasesOn()
    {
        static $on;
        if ($on === null) {
            $plugins = wa('tasks')->getConfig()->getPlugins();
            $on = isset($plugins['releases']);
        }
        return $on;
    }

    protected function getFields()
    {
        static $fields;
        if ($fields !== null) {
            return $fields;
        }
        return $fields = $this->obtainFields();
    }

    protected function obtainFields()
    {
        $fields = array(
            'id' => 'ID',
            'name' => 'Субж',
            'text' => 'Текст',
            'creator_name' => 'Автор',
            'create_datetime' => 'Создано',
            'update_datetime' => 'Обновлено',
            'assigned_name' => 'Назначенный',
            'project_name' => 'Проект',
            'milestone_name' => 'Срок',
            'number' => 'Номер',
            'status_name' => 'Статус',
            'priority_name' => 'Приоритет',
            'contact_name' => 'Сменивший назначенного/статус',
            'due_date' => 'Дедлайн'
        );
        if ($this->isReleasesOn()) {
            $fields += array(
                'plugin_releases_type_name' => 'Тип',
                'plugin_releases_gravity_name' => 'Важность',
                'plugin_releases_timecosts_plan' => 'Трудозатраты план',
                'plugin_releases_timecosts_fact' => 'Трудозатраты факт',
                'plugin_releases_affected_version' => 'Где найдено',
                'plugin_releases_resolution_name' => 'Результат'
            );
        }
        return $fields;
    }

    /**
     * @return int
     */
    protected function getOffset()
    {
        return (int)$this->getCacheVar('offset');
    }

    /**
     * @param int $offset
     */
    protected function setOffset($offset)
    {
        return $this->setCacheVar('offset', $offset);
    }

    public function isExportDone()
    {
        return (bool)$this->getCacheVar('is_export_done');
    }

    protected function markExportAsDone()
    {
        $this->setCacheVar('is_export_done', 1);
    }

    /**
     * @return string
     */
    protected function getHash()
    {
        return (string)$this->getCacheVar('hash');
    }

    /**
     * @param string $hash
     */
    protected function setHash($hash)
    {
        $hash = (string)$hash;
        if ($this->getHash() !== $hash) {
            $this->setCacheVar('hash', $hash);
        }
    }

    protected function getFilters()
    {
        return (string)$this->getCacheVar('filters');
    }

    protected function setFilters($filters)
    {
        $filters = (string)$filters;
        $this->setCacheVar('filters', $filters);
    }

    protected function getOrder()
    {
        return (string)$this->getCacheVar('order');
    }

    protected function setOrder($order)
    {
        $order = (string)$order;
        $this->setCacheVar('order', $order);
    }

    /**
     * @param $result
     */
    protected function saveResultChunk($result)
    {
        $saved_result = $this->getCacheVar('result', true);
        if ($saved_result === null) {
            $saved_result = array();
            foreach ($result as $field_id => $res) {
                $saved_result[$field_id]['name'] = $res['name'];
                $saved_result[$field_id]['is_empty_column'] = true;
                $saved_result[$field_id]['data'] = array();
            }
        }

        foreach ($result as $field_id => $res) {
            foreach ($res['data'] as $task_id => $value) {
                $saved_result[$field_id]['is_empty_column'] = false;
                $saved_result[$field_id]['data'][$task_id] = $value;
            }
        }

        $this->setCacheVar('result', $saved_result, true);
    }

    /**
     * @return array
     */
    protected function getSavedResult()
    {
        return (array)$this->getCacheVar('result', true);
    }

    /**
     * @return bool
     */
    protected function isFieldsReceived()
    {
        return (bool)$this->getCacheVar('is_fields_received');
    }

    protected function markFieldsAsReceived()
    {
        $this->setCacheVar('is_fields_received', 1);
    }

    /**
     * @return bool
     */
    public function isExportResultGettingDone()
    {
        return (bool)$this->getCacheVar('is_export_result_getting_done');
    }

    protected function markExportResultGettingAsDone()
    {
        $this->setCacheVar('is_export_result_getting_done', 1);
    }

    protected function getCacheVar($name, $json = false)
    {
        if (array_key_exists($name, $this->vars)) {
            return $this->vars[$name];
        }

        $key = $this->getVarKey($name);
        $value = $this->getCache()->get($key);

        if ($value === null || !$json) {
            return $this->vars[$name] = $value;
        }
        return $this->vars[$name] = json_decode($value, true);
    }

    protected function setCacheVar($name, $value, $json = false)
    {
        $key = $this->getVarKey($name);
        if ($value === null) {
            $this->getCache()->delete($key);
            if (array_key_exists($name, $this->vars)) {
                unset($this->vars[$name]);
            }
            return;
        }
        $this->vars[$name] = $value;
        if ($json) {
            $value = json_encode($value);
        }
        $this->getCache()->set($key, $value);
    }

    protected function getVarKey($name)
    {
        return $name . '_var_' . __CLASS__ . $this->process_id;
    }

    /**
     * @return waCache
     */
    protected function getCache()
    {
        if (self::$cache !== null) {
            return self::$cache;
        }
        $cache = wa('tasks')->getConfig()->getCache();
        if (!($cache instanceof waCache)) {
            $cache_adapter = new waFileCacheAdapter(array());
            $cache = new waCache($cache_adapter, 'tasks');
        }
        return self::$cache = $cache;
    }
}
