<?php

class tasksCollection
{
    public const FIELDS_TO_GET = '*,log,create_contact,assigned_contact,attachments,tags,project,favorite,relations';

    public const HASH_SEARCH = 'search';
    public const HASH_UNASSIGNED = 'unassigned';
    public const HASH_ASSIGNED = 'assigned';
    public const HASH_TAG = 'tag';
    public const HASH_INBOX = 'inbox';
    public const HASH_FAVORITES = 'favorites';
    public const HASH_OUTBOX = 'outbox';
    public const HASH_STATUS = 'status';
    public const HASH_ID = 'id';
    public const HASH_UUID = 'uuid';
    public const HASH_PUBLIC_HASH = 'public_hash';
    public const HASH_PROJECT = 'project';
    public const HASH_SCOPE = 'scope';
    public const HASH_URGENT = 'urgent';
    public const HASH_NUMBER = 'number';

    public const ORDER_NEWEST = 'newest';
    public const ORDER_OLDEST = 'oldest';
    public const ORDER_DUE = 'due';
    public const ORDER_PRIORITY = 'priority';

    public const ORDER_LIST = [
        self::ORDER_NEWEST,
        self::ORDER_OLDEST,
        self::ORDER_DUE,
        self::ORDER_PRIORITY,
    ];

    protected $filtered = false;
    protected $prepared;

    protected $order_by;
    protected $default_order_by = 't.priority DESC, t.create_datetime';

    protected $where = [];
    protected $fields = [];
    protected $other_fields = [];
    protected $joins = [];
    protected $join_index = [];
    protected $options = [
        'check_rights' => true,
    ];
    protected $info = [];
    protected $hash;
    protected $count;

    public function __construct($hash = '', $options = [])
    {
        foreach ($options as $k => $v) {
            $this->options[$k] = $v;
        }
        $this->setHash($hash);
    }

    protected function setHash($hash)
    {
        if (is_array($hash)) {
            $hash = '/id/' . implode(',', $hash);
        }
        if (substr($hash, 0, 1) == '#') {
            $hash = substr($hash, 1);
        }
        $this->hash = trim($hash, '/');
        if ($this->hash == 'all') {
            $this->hash = '';
        }
        $this->hash = explode('/', $this->hash, 2);
    }

    public function getInfo()
    {
        if (!$this->prepared) {
            $this->prepare();
        }

        return $this->info;
    }

    protected function prepare($add = false)
    {
        if (!$this->prepared && $this->options['check_rights'] && !wa()->getUser()->isAdmin('tasks')) {
            $is_available = wa()->getUser()->getRights('tasks', 'project.%');
            if (ifempty($is_available['all']) != 2) {
                $full_access_projects = [];
                $limited_access_projects = [];
                if (ifempty($is_available[tasksProjectRepository::GET_PROJECT_ALL]) == 1) {
                    $projectsAll = tsks()->getEntityRepository(tasksProject::class)
                        ->getProjectsAsArray(tasksProjectRepository::GET_PROJECT_ALL);
                    foreach ($projectsAll as $id => $projectData) {
                        $limited_access_projects[$id] = $id;
                    }
                } else {
                    foreach ($is_available as $project_id => $level) {
                        if ($level == 2) {
                            $full_access_projects[$project_id] = $project_id;
                        } else {
                            if ($level == 1) {
                                $limited_access_projects[$project_id] = $project_id;
                            }
                        }
                    }
                }

                $condition = [];
                if ($full_access_projects) {
                    $condition[] = 't.project_id IN (' . implode(',', $full_access_projects) . ')';
                }
                if ($limited_access_projects) {
                    $current_contact_id = wa()->getUser()->getId();
                    $cond = "t.project_id IN (" . implode(",", $limited_access_projects) . ") AND 
                        (t.assigned_contact_id={$current_contact_id} OR t.create_contact_id={$current_contact_id})";
                    $condition[] = $cond;
                }
                if (!$condition) {
                    $condition[] = '0';
                }
                $this->addWhere('((' . implode(') OR (', $condition) . '))');
            }
        }

        if (!$this->prepared || $add) {
            $type = $this->hash[0];

            if ($type) {
                $method = strtolower($type) . 'Prepare';
                if (method_exists($this, $method)) {
                    $this->$method(isset($this->hash[1]) ? $this->hash[1] : '');
                } else {

                    $params = [
                        'collection' => $this,
                        'add' => $add,
                    ];
                    /**
                     * @event tasks_collection
                     *
                     * @param array [string]mixed $params
                     * @param array [string]tasksCollection $params['collection']
                     * @param array [string]boolean $params['add']
                     *
                     * @return bool null if ignored, true when something changed in the collection
                     */
                    $processed = wa()->event('tasks_collection', $params);
                    if (!$processed) {
                        throw new waException('Unknown collection hash type: ' . htmlspecialchars($type));
                    }
                }
            }
            if ($this->prepared) {
                return;
            }
            $this->prepared = true;
        }
    }

    public function getJoinedAlias($table)
    {
        $alias = $this->getTableAlias($table);

        return $alias . $this->join_index[$alias];
    }

    protected function getTableAlias($table)
    {
        $t = explode('_', $table);
        $alias = '';
        foreach ($t as $tp) {
            if ($tp == 'tasks') {
                continue;
            }
            $alias .= substr($tp, 0, 1);
        }
        if (!$alias) {
            $alias = $table;
        }

        return $alias;
    }

    public function addJoin($table, $on = null, $where = null)
    {
        $type = '';
        if (is_array($table)) {
            if (isset($table['on'])) {
                $on = $table['on'];
            }
            if (isset($table['where'])) {
                $where = $table['where'];
            }
            if (isset($table['type'])) {
                $type = $table['type'];
            }
            $table = $table['table'];
        }

        $alias = $this->getTableAlias($table);

        if (!isset($this->join_index[$alias])) {
            $this->join_index[$alias] = 1;
        } else {
            $this->join_index[$alias]++;
        }
        $alias .= $this->join_index[$alias];

        $join = [
            'table' => $table,
            'alias' => $alias,
            'type' => $type,
        ];
        if ($on) {
            $join['on'] = str_replace(':table', $alias, $on);
        }
        $this->joins[] = $join;
        if ($where) {
            $this->where[] = str_replace(':table', $alias, $where);
        }

        $this->filtered = true;

        return $alias;
    }

    public function addWhere($condition)
    {
        $this->where[] = $condition;
        $this->filtered = true;

        return $this;
    }

    protected function getSQL()
    {
        $this->prepare();
        $sql = "FROM tasks_task t";

        if ($this->joins) {
            foreach ($this->joins as $join) {
                $alias = isset($join['alias']) ? $join['alias'] : '';
                if (isset($join['on'])) {
                    $on = $join['on'];
                } else {
                    $on = "t.id = " . ($alias ? $alias : $join['table']) . ".task_id";
                }
                $sql .= (!empty($join['type']) ? " " . $join['type'] : '') . " JOIN " . $join['table'] . " " . $alias . " ON " . $on;
            }
        }

        if ($this->where) {
            $sql .= " WHERE " . implode(" AND ", $this->where);
        }

        return $sql;
    }

    /**
     * Converts fields string as accepted by getTasks()
     * into list of SQL fields and list of fields to fetch later.
     */
    protected function getFields($fields)
    {
        if (!is_array($fields)) {
            $fields = explode(",", $fields);
        }
        $fields = array_map('trim', $fields);

        $model_fields = [];
        $other_fields = [];
        $metadata = $this->getModel()->getMetadata();
        foreach ($fields as $f) {
            if ($f == '*') {
                $model_fields += array_fill_keys(array_keys($metadata), 1);
            } else {
                if (isset($metadata[$f])) {
                    $model_fields[$f] = 1;
                } else {
                    $other_fields[$f] = 1;
                }
            }
        }

        return [$model_fields, $other_fields];
    }

    protected function getSqlFields($model_fields)
    {
        if (!$model_fields) {
            return 't.*';
        }
        $metadata = $this->getModel()->getMetadata();
        if (!array_diff_key($metadata, $model_fields)) {
            $model_fields = ['*' => 1] + array_diff_key($model_fields, $metadata);
        }

        return 't.' . implode(',t.', array_keys($model_fields));
    }

    public function getTasks($fields = "*", $offset = 0, $limit = null, &$total_count = null)
    {
        if ($limit === null) {
            if ($offset) {
                $limit = $offset;
                $offset = 0;
            } else {
                $limit = tasksOptions::getTasksPerPage();
            }
        }

        [$fields, $other_fields] = $this->getFields($fields);
        $fields['id'] = 1;

        if (!empty($other_fields['create_contact'])) {
            $fields['create_contact_id'] = 1;
        }
        if (!empty($other_fields['assigned_contact'])) {
            $fields['assigned_contact_id'] = 1;
        }
        if (!empty($other_fields['contact'])) {
            $fields['contact_id'] = 1;
        }

        if (!empty($other_fields['log']) || !empty($other_fields['project'])) {
            $fields['project_id'] = 1;
        }
        if (!empty($other_fields['status'])) {
            $fields['status_id'] = 1;
        }
        if (!empty($other_fields['tags']) || !empty($other_fields['favorite_tags'])) {
            $other_fields['full_tags'] = 1;
        }
        $defaults = array_fill_keys(array_keys($other_fields), null);

        if (func_num_args() > 3) {
            $sql = "SELECT SQL_CALC_FOUND_ROWS ";
            $total_count = true;
        } else {
            $sql = "SELECT ";
        }

        $sql = $sql . $this->getSqlFields($fields) . ' ' .
            $this->getSQL() . ' ' .
            $this->getOrderBy() . ' ' .
            "LIMIT " . ($offset ? ((int) $offset) . ',' : '') . (int) $limit;

        $data = $this->getModel()->query($sql)->fetchAll('id');
        if (!$data) {
            $total_count = 0;

            return [];
        }

        if ($total_count) {
            $this->count = $total_count = (int) $this->getModel()->query('SELECT FOUND_ROWS()')->fetchField();
        }

        $ids = array_keys($data);

        // Preloading project statuses saves many SQL requests
        // when list contains tasks from different projects
        if (!empty($fields['project_id'])) {
            $project_ids = [];
            foreach ($data as $t) {
                $project_ids[$t['project_id']] = $t['project_id'];
            }
            if (count($project_ids) > 1) {
                $project_statuses_model = new tasksProjectStatusesModel();
                $project_statuses_model->getByProject($project_ids);
                $project_status_params_model = new tasksProjectStatusParamsModel();
                $project_status_params_model->getByProject($project_ids);
            }
        }

        $contact_ids = [];
        if (!empty($other_fields['create_contact'])) {
            foreach ($data as $t) {
                $contact_ids[$t['create_contact_id']] = $t['create_contact_id'];
            }
        }
        if (!empty($other_fields['assigned_contact'])) {
            foreach ($data as $t) {
                if ($t['assigned_contact_id']) {
                    $contact_ids[$t['assigned_contact_id']] = $t['assigned_contact_id'];
                }
            }
        }
        if (!empty($other_fields['contact'])) {
            foreach ($data as $t) {
                if ($t['contact_id']) {
                    $contact_ids[$t['contact_id']] = $t['contact_id'];
                }
            }
        }

        if ($contact_ids) {
            $contact_model = new waContactModel();
            $contacts = $contact_model->getById($contact_ids);
            foreach ($data as &$t) {
                if (!empty($other_fields['create_contact']) && isset($contacts[$t['create_contact_id']])) {
                    $c = $contacts[$t['create_contact_id']];
                    $c['name'] = waContactNameField::formatName($c);
                    $t['create_contact'] = $c;
                }
                if (!empty($other_fields['assigned_contact']) && isset($contacts[$t['assigned_contact_id']])) {
                    $c = $contacts[$t['assigned_contact_id']];
                    $c['name'] = waContactNameField::formatName($c);
                    $t['assigned_contact'] = $c;
                }
                if (!empty($other_fields['contact']) && isset($contacts[$t['contact_id']])) {
                    $c = $contacts[$t['contact_id']];
                    $c['name'] = waContactNameField::formatName($c);
                    $t['contact'] = $c;
                }
            }
            unset($t);
        }

        if (!empty($other_fields['attachments'])) {
            $defaults['attachments'] = [];
            $defaults['all_attachments'] = [];
            $attach_model = new tasksAttachmentModel();
            $rows = $attach_model->getByField('task_id', $ids, true);
            foreach ($rows as $row) {
                $data[$row['task_id']]['all_attachments'][] = $row;
                if (empty($row['log_id'])) {
                    $data[$row['task_id']]['attachments'][] = $row;
                }
            }
        }

        if (!empty($other_fields['log'])) {
            $defaults['log'] = [];
            $log_model = new tasksTaskLogModel();
            foreach ($log_model->getByTasks($data) as $task_id => $logs) {
                $data[$task_id]['log'] = $logs;
            }
        }
        if (!empty($other_fields['full_tags'])) {
            $defaults['full_tags'] = [];
            $task_tags_model = new tasksTaskTagsModel();
            foreach ($task_tags_model->getByTasks($data) as $task_id => $tags) {
                $data[$task_id]['full_tags'] = $tags;
            }
        }
        if (!empty($other_fields['project'])) {
            $defaults['project'] = [];
            $projects = tsks()->getEntityRepository(tasksProject::class)
                ->getProjectsAsArray(tasksProjectRepository::GET_PROJECT_ALL);
        }
        if (!empty($other_fields['status'])) {
            $defaults['status'] = [];
            $statuses = tasksHelper::getStatuses(null, false);
        }
        if (!empty($other_fields['favorite'])) {
            $defaults['favorite'] = false;
            $favorite_model = new tasksFavoriteModel();
            $favorites = $favorite_model->getByField(
                ['contact_id' => wa()->getUser()->getId(), 'task_id' => $ids],
                'task_id'
            );
            foreach ($favorites as $task_id => $_) {
                $data[$task_id]['favorite'] = 1;
            }
        }

        foreach ($data as &$t) {
            $t += $defaults;
            if (!empty($other_fields['project']) && !empty($projects[$t['project_id']])) {
                $t['project'] = $projects[$t['project_id']];
            }
            if (!empty($other_fields['status']) && !empty($statuses[$t['status_id']])) {
                $t['status'] = $statuses[$t['status_id']];
            }
            if (!empty($other_fields['tags'])) {
                $t['tags'] = [];
                foreach ($t['full_tags'] as $tag) {
                    $t['tags'][$tag['id']] = $tag['name'];

                }
            }
            if (!empty($other_fields['favorite_tags'])) {
                $t['favorite_tags'] = [];
                foreach ($t['full_tags'] as $tag) {
                    if (!empty($tag['favorite'])) {
                        $t['favorite_tags'][$tag['id']] = $tag['name'];
                    }
                }
            }
        }
        unset($t);

        if (!empty($other_fields['relations'])) {
            $data = $this->addRelationsToTasks($data);
        }

        return $data;
    }

    protected function addRelationsToTasks($tasks)
    {
        if (!empty($tasks)) {

            $tasks_relations_model = new tasksTaskRelationsModel();
            $tasks_relations = $tasks_relations_model->getRelations(array_keys($tasks), true);

            foreach ($tasks_relations as $id => $relations) {
                if (isset($tasks[$id])) {
                    $tasks[$id]['relations'] = $relations;
                }
            }
        }

        return $tasks;
    }

    public function count()
    {
        if ($this->count !== null) {
            return $this->count;
        }
        $sql = $this->getSQL();
        $sql = "SELECT COUNT(" . ($this->joins ? 'DISTINCT ' : '') . "t.id) " . $sql;
        $count = $this->count = (int) $this->getModel()->query($sql)->fetchField();

        return $count;
    }

    public function getLastUpdateTime()
    {
        $sql = $this->getSQL();
        $sql = "SELECT MAX(update_datetime) " . $sql;
        $datetime = $this->getModel()->query($sql)->fetchField();
        if (!$datetime) {
            return 0;
        }

        return strtotime($datetime);
    }

    /**
     * @return tasksTaskModel
     */
    public function getModel()
    {
        return new tasksTaskModel();
    }

    public static function parseConditions($query)
    {
        $escapedBS = 'ESCAPED_BACKSLASH';
        while (false !== strpos($query, $escapedBS)) {
            $escapedBS .= rand(0, 9);
        }
        $escapedAmp = 'ESCAPED_AMPERSAND';
        while (false !== strpos($query, $escapedAmp)) {
            $escapedAmp .= rand(0, 9);
        }
        $query = str_replace('\\&', $escapedAmp, str_replace('\\\\', $escapedBS, $query));
        $query = explode('&', $query);
        $result = [];
        foreach ($query as $part) {
            if (!($part = trim($part))) {
                continue;
            }
            $part = str_replace([$escapedBS, $escapedAmp], ['\\\\', '\\&'], $part);
            if ($temp = preg_split("/(\\\$=|\^=|\*=|==|!=|>=|<=|=|>|<)/uis", $part, 2, PREG_SPLIT_DELIM_CAPTURE)) {
                $name = array_shift($temp);
                if ($name == 'tag') {
                    $temp[1] = explode('||', $temp[1]);
                }
                if ($temp[0] == '>=') {
                    $result[$name][0] = $temp;
                } elseif ($temp[0] == '<=') {
                    $result[$name][1] = $temp;
                } else {
                    $result[$name] = $temp;
                }
            }
        }

        return $result;
    }

    /**
     * Returns expression for SQL
     *
     * @param string $op    - operand ==, >=, etc
     * @param string $value - value
     *
     * @return string
     */
    protected function getExpression($op, $value, $type = null)
    {
        $model = $this->getModel();
        switch ($op) {
            case '>':
            case '>=':
            case '<':
            case '<=':
            case '!=':
                return " " . $op . " '" . $model->escape($value, $type) . "'";
            case "^=":
                return " LIKE '" . $model->escape($value, 'like') . "%'";
            case "$=":
                return " LIKE '%" . $model->escape($value, 'like') . "'";
            case "*=":
                return " LIKE '%" . $model->escape($value, 'like') . "%'";
            case "==":
                if (strtolower($value) == 'null') {
                    return " IS NULL";
                }
            // otherwise breakthrough
            case "=";
            default:
                return " = '" . $model->escape($value, $type) . "'";
        }
    }

    protected function getFieldType($field)
    {
        $meta = $this->getModel()->getMetadata();

        return $meta[$field]['type'] ?? null;
    }

    protected function idPrepare($ids)
    {
        $ids = explode(',', (string) $ids);
        foreach ($ids as $i => $id) {
            $ids[$i] = (int) trim($id);
            if (!$ids[$i]) {
                unset($ids[$i]);
            }
        }

        if ($ids) {
            $this->where[] = "t.id IN (" . implode(',', $ids) . ")";
            $this->default_order_by = 'FIELD(t.id, ' . implode(',', $ids) . ')';
        } else {
            $this->where[] = '0';
        }
    }

    protected function uuidPrepare($ids)
    {
        $ids = explode(',', (string) $ids);
        foreach ($ids as $i => $id) {
            $ids[$i] = trim($id);
            if (!$ids[$i]) {
                unset($ids[$i]);
            }
        }

        if ($ids) {
            $this->where[] = sprintf("t.uuid IN ('%s')", implode("','", $ids));
            $this->default_order_by = 't.id';
        } else {
            $this->where[] = '0';
        }
    }

    protected function public_hashPrepare($ids): void
    {
        $ids = explode(',', (string) $ids);
        foreach ($ids as $i => $id) {
            $ids[$i] = trim($id);
            if (!$ids[$i]) {
                unset($ids[$i]);
            }
        }

        if ($ids) {
            $this->where[] = sprintf("t.public_hash IN ('%s')", implode("','", $ids));
            $this->default_order_by = 't.id';
        } else {
            $this->where[] = '0';
        }
    }

    protected function favoritesPrepare()
    {
        $this->addJoin('tasks_favorite', null, ':table.contact_id = ' . (int) wa()->getUser()->getId());
    }

    protected function inboxPrepare()
    {
        $this->assignedPrepare(wa()->getUser()->getId());
        $this->addWhere('t.hidden_timestamp < ' . time());
    }

    protected function hiddenPrepare()
    {
        $this->assignedPrepare(wa()->getUser()->getId());
        $this->addWhere('t.hidden_timestamp >= ' . time());
    }

    protected function outboxPrepare()
    {
        $this->creatorPrepare(wa()->getUser()->getId());
    }

    protected function urgentPrepare()
    {
        $this->searchPrepare('priority>0');
        $this->addWhere('t.status_id >= 0');
        $this->addJoin('tasks_project', ':table.id = t.project_id', ':table.archive_datetime IS NULL');
    }

    /**
     * Handler for /search/* hashes, and also used during filtering, see $this->filter()
     */
    protected function searchPrepare($query)
    {
        $query = urldecode($query);
        $i = $offset = 0;
        $query_parts = [];
        while (($j = strpos($query, '&', $offset)) !== false) {
            // escaped &
            if ($query[$j - 1] != '\\') {
                $query_parts[] = substr($query, $i, $j - $i);
                $i = $j + 1;
            }
            $offset = $j + 1;
        }
        $query_parts[] = substr($query, $i);

        $unknown_conditions = [];

        $model = $this->getModel();
        foreach ($query_parts as $part) {
            if (!($part = trim($part))) {
                continue;
            }
            $parts = preg_split("/(\\\$=|\^=|\*=|==|!=|>=|<=|=|>|<)/uis", $part, 2, PREG_SPLIT_DELIM_CAPTURE);
            if (!$parts) {
                continue;
            } else {
                if (count($parts) == 1) {
                    $parts = ['query', '=', $part];
                }
            }
            if ($parts[0] == 'query') {
                if (empty($this->info)) {
                    $this->info = $parts[2];
                }
                // поиск по номеру таски X.N
                if (preg_match("/^\d+\.\d+$/", $parts[2])) {
                    @list($project_id, $number) = explode('.', $parts[2], 2);
                    $task = $this->getModel()->getByField([
                        'project_id' => (int) $project_id,
                        'number' => (int) $number,
                    ]);
                    if ($task) {
                        $this->where[] = 't.id = ' . $task['id'];

                        return;
                    }
                }
                if (mb_strlen($parts[2]) <= 3) {
                    // для поиска коротких слов
                    $this->where[] = "CONCAT(t.name, ' ', t.text) LIKE '%" . $model->escape($parts[2], 'like') . "%'";
                } else {
                    $q = $parts[2];
                    if (!preg_match('![*+~()<>\-"]!', $q)) {
                        $q = '+' . preg_replace('~\s+~', '* +', trim($q)) . '*';
                    }
                    $this->where[] = "MATCH(t.name, t.text) AGAINST ('" . $model->escape($q) . "' IN BOOLEAN MODE)";
                }
            } elseif ($parts[0] == 'from_contact_id') {
                $this->where[] = 'IFNULL(t.contact_id, t.create_contact_id)' . $this->getExpression(
                        $parts[1],
                        $parts[2]
                    );
            } elseif ($parts[0] == 'tag') {
                $this->tagPrepare($parts[2]);
            } elseif ($model->fieldExists($parts[0])) {

                //Show all tasks if status_id == all
                if (!($parts[0] == 'status_id' && $parts[2] == 'all')) {
                    $this->where[] = 't.' . $parts[0] . $this->getExpression($parts[1], $parts[2],
                            $this->getFieldType($parts[0]));
                }

            } else {
                $condition = [
                    'field' => $parts[0],
                    'op' => isset($parts[1]) ? $parts[1] : null,
                    'value' => isset($parts[2]) ? $parts[2] : null,
                ];
                $condition['expression'] = $this->getExpression($condition['op'], $condition['value']);
                $unknown_conditions[] = $condition;
            }
        }

        if ($this->getType() == 'search') {
            $this->addJoin('tasks_project', ':table.id = t.project_id', ':table.archive_datetime IS NULL');
        }

        $params = [
            'collection' => $this,
            'conditions' => $unknown_conditions,
        ];

        /**
         * Extend search preparation process by implementing unknown conditions
         * Triggered when condition not processed by core logic
         *
         * @event tasks_collection_search
         *
         * @param array [string]mixed $params
         * @param array [string]tasksCollection $params['collection'] current instance of collection
         * @param array [string]boolean $params['conditions'] condition structures
         * @param string [string]boolean $params['conditions'][%index%]['field'] left hand part of condition
         * @param string [string]boolean $params['conditions'][%index%]['op'] operator of condition
         * @param string [string]boolean $params['conditions'][%index%]['value'] right hand part of condition
         * @param string [string]boolean $params['conditions'][%index%]['expression'] sql escaped expression literal combined by 'op' and 'value'
         */
        wa()->event('tasks_collection_search', $params);

    }

    /**
     * @param array|string $query
     */
    public function filter($query)
    {
        if (is_array($query)) {
            $query = http_build_query($query);
        }
        $this->searchPrepare($query);
    }

    /**
     * @param int $contact_id
     */
    protected function creatorPrepare($contact_id)
    {
        $this->prepareContactByField($contact_id, 'create_contact_id');
    }

    protected function assignedPrepare($contact_id)
    {
        $this->prepareContactByField($contact_id, 'assigned_contact_id');
    }

    protected function contactPrepare($contact_id)
    {
        $this->prepareContactByField($contact_id, 'contact_id');
    }

    protected function prepareContactByField($contact_id, $field)
    {
        if ($this->getModel()->fieldExists($field)) {
            $contact_model = new waContactModel();
            $contact = $contact_model->getById($contact_id);
            if ($contact) {
                $this->info = $contact;
                $contact_id = (int) $contact_id;
                $this->where[] = "t.{$field} = {$contact_id}";
                $this->addJoin('tasks_project', ':table.id = t.project_id', ':table.archive_datetime IS NULL');

                return;
            }
        }
        $this->where[] = '0';
    }

    protected function scopePrepare($id)
    {
        $where = 0;
        $info = null;

        $model = new tasksMilestoneModel();
        if ((is_string($id) && strtolower($id) === 'null')) {
            $where = 't.milestone_id IS NULL';
            $info = $model->getEmptyRow();
        } elseif ($id == 0) {
            $where = 't.milestone_id = 0';
            $info = $model->getEmptyRow();
        } else {
            $scope = $model->getById($id);
            if ($scope) {
                $where = 't.milestone_id = ' . (int) $id;
                $info = $scope;
            }
        }

        $this->where[] = $where;
        $this->info = $info;
    }

    protected function projectPrepare($id)
    {
        $project_model = new tasksProjectModel();
        $project = $project_model->getById($id);

        if ($project) {
            $this->where[] = 't.project_id = ' . (int) $id;
            $this->info = $project;
        } else {
            $this->where[] = 0;
        }
    }

    protected function numberPrepare($number)
    {
        $projectAndNumber = explode('.', $number);
        if (count($projectAndNumber) !== 2) {
            return;
        }

        $this->where[] = sprintf('t.project_id = %d AND t.number = %d', $projectAndNumber[0], $projectAndNumber[1]);
    }

    protected function statusPrepare($status)
    {
        $status_id = $status;
        if (!is_numeric($status)) {
            switch ($status) {
                case 'inprogress':
                    $status_id = null;
                    $this->where[] = 't.status_id >= 0';
                    break;
                case 'done':
                    $status_id = -1;
                    $this->where[] = 't.status_id = -1';
                    break;
                default:
                    $status_id = null;
                    $this->where[] = '0';
            }
        } else {
            $this->where[] = 't.status_id = ' . (int) $status;
        }
        $this->addJoin('tasks_project', ':table.id = t.project_id', ':table.archive_datetime IS NULL');

        if ($status_id !== null) {
            $statuses = tasksHelper::getStatuses(null, false);
            if (!empty($statuses[$status_id])) {
                $this->info = $statuses[$status_id];
            }
        }
    }

    protected function unassignedPrepare()
    {
        $this->where[] = 't.assigned_contact_id IS NULL';
        $this->where[] = 't.status_id >= 0';
        $this->addJoin('tasks_project', ':table.id = t.project_id', ':table.archive_datetime IS NULL');
    }

    protected function tagPrepare($hash)
    {
        $hash = explode('/', $hash, 2);
        $condition = ifset($hash[1]);
        $tag_names = explode(',', $hash[0]);
        if ($condition != 'all') {
            $condition = 'any';
        }

        $tags = [];
        $tag_model = new tasksTagModel();
        foreach ($tag_model->getByField('name', $tag_names, 'id') as $tag_id => $tag) {
            $tags[$tag_id] = $tag['name'];
        }

        if (!$tags) {
            $this->where[] = '0';

            return;
        }

        if ($condition == 'any') {
            $this->addJoin(
                'tasks_task_tags',
                ':table.task_id=t.id',
                ':table.tag_id IN (' . implode(',', array_keys($tags)) . ')'
            );
        } else {
            if (count(array_flip($tag_names)) > count($tags)) {
                $this->where[] = '0';
            } else {
                foreach ($tags as $tag_id => $tag_name) {
                    $this->addJoin('tasks_task_tags', ':table.task_id=t.id', ':table.tag_id=' . $tag_id);
                }
            }
        }
    }

    /**
     * @return array
     */
    public function getHash()
    {
        return $this->hash;
    }

    /**
     * Returns type of the collection
     *
     * @return string
     */
    public function getType()
    {
        return $this->hash[0];
    }

    /**
     * Returns ORDER BY clause
     *
     * @return string
     */
    protected function getOrderBy()
    {
        $order_by = '';
        if ($this->order_by === null) {
            $order_by = $this->default_order_by;
        } elseif ($this->order_by) {
            $order_by = $this->order_by;
        }

        return $order_by ? " ORDER BY " . $order_by : '';
    }

    public function orderBy($field, $order = 'ASC', $validate = true)
    {
        $m = $this->getModel();
        $metadata = $m->getMetadata();
        if (!empty($metadata[$field])) {
            $field = 't.' . $field;
        } else {
            if ($validate) {
                throw new waException('Unacceptable collection ordering.');
            }
        }
        if (strtolower($order) != 'desc') {
            $order = '';
        }
        $this->order_by = "{$field} {$order}";
    }

    public function orderByDue()
    {
        $table = 'tasks_milestone';

        $alias = null;
        foreach ($this->joins as $join) {
            if ($join['table'] === $table) {
                $alias = $table['alias'];
                break;
            }
        }

        if (!$alias) {
            $this->addJoin([
                'type' => 'left',
                'table' => $table,
                'on' => 't.milestone_id = :table.id',
            ]);
            $alias = $this->getJoinedAlias($table);
        }

        $stub = '9999-12-31';

        $order = [
            "IFNULL(t.due_date, IFNULL({$alias}.due_date, '{$stub}'))",
            "t.priority DESC",
            "t.create_datetime",
            "t.id",
        ];
        $this->orderBy(implode(',', $order), '', false);
    }
}
