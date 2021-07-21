<?php
class tasksTaskLogModel extends waModel
{
    protected $table = 'tasks_task_log';

    public const ACTION_TYPE_CREATE = 'create';
    public const ACTION_TYPE_COMMENT       = 'comment';
    public const ACTION_TYPE_FORWARD = 'forward';
    public const ACTION_TYPE_RETURN = 'return';
    public const ACTION_TYPE_EDIT = 'edit';
    public const ACTION_TYPE_EMPTY = '';

    /**
     * @param array $data key value of DB record + some special keys
     *   - 'params' key-value map of log params
     *   - 'attachments_hash' hash by which can be found files to attach
     *   - 'attachments' array of paths to files to attach
     * @return bool|int
     * @throws waException
     */
    public function add($data)
    {
        if (empty($data['project_id'])) {
            throw new waException('Field project_id is required');
        }
        if (empty($data['task_id'])) {
            throw new waException('Field task_id is required');
        }
        if (!isset($data['create_datetime'])) {
            $data['create_datetime'] = date('Y-m-d H:i:s');
        }
        if (!isset($data['contact_id'])) {
            $data['contact_id'] = wa()->getUser()->getId();
        }
        if (!isset($data['text'])) {
            $data['text'] = '';
        }
        $log_id = $this->insert($data);

        if (!empty($data['params'])) {
            $params_model = new tasksTaskLogParamsModel();
            $task_id = $data['task_id'];
            $params = array();
            foreach ($data['params'] as $name => $value) {
                $params[] = array(
                    'task_id' => $task_id,
                    'log_id' => $log_id,
                    'name' => $name,
                    'value' => is_array($value) ? json_encode($value) : $value
                );
            }
            $params_model->multipleInsert($params);
        }

        if (isset($data['attachments_hash'])) {
            $am = new tasksAttachmentModel();
            $am->addAttachmentsByHash($data['task_id'], $log_id, $data['attachments_hash']);
        } elseif (isset($data['attachments']) && is_array($data['attachments'])) {
            $am = new tasksAttachmentModel();
            foreach ($data['attachments'] as $attachment) {
                $am->addAttachment($data['task_id'], $log_id['id'], $attachment);
            }
        }

        return $log_id;
    }

    /**
     * @return array
     */
    public function getContactIds()
    {
        $sql = 'SELECT DISTINCT contact_id FROM '.$this->table.'
                UNION
                SELECT DISTINCT assigned_contact_id FROM '.$this->table.' WHERE assigned_contact_id IS NOT NULL';
        return $this->query($sql)->fetchAll(null, true);
    }

    public function getTaskComments($task_id)
    {
        $where = $this->getWhereByField(array(
            'task_id' => $task_id,
            'action' => self::ACTION_TYPE_COMMENT
        ));
        return $this->select('*')->where($where)->order('id')->fetchAll('id');
    }

    /**
     * @param int $id
     * @param string|string[] $type - default is ACTION_TYPE_COMMENT
     * @return array|null COMMENT (of any other specified by $type) log item from DB with extra calculated fields
     * @see getComments
     * @throws waException
     */
    public function getComment($id, $type = self::ACTION_TYPE_COMMENT)
    {
        $comments = $this->getComments($id, $type);
        return isset($comments[$id]) ? $comments[$id] : null;
    }

    /**
     * @param int[] $ids
     * @param string|string[] $type - default is ACTION_TYPE_COMMENT
     * @return array of COMMENT (of any other specified by $type) log items indexed by 'id' field
     *   Each item also has extra calculated fields
     *    - bool 'is_empty' Empty item is when NO text and NO attachments
     *    - int 'attachments_count' Count of attachments
     *
     * @throws waException
     */
    public function getComments($ids, $type = self::ACTION_TYPE_COMMENT)
    {
        $ids = tasksHelper::toIntArray($ids);
        $ids = tasksHelper::dropNotPositive($ids);

        if (!is_array($ids) || empty($ids)) {
            return array();
        }

        $types = tasksHelper::toStrArray($type);
        $types = array_unique($types);
        if (!$types) {
            $types[] = self::ACTION_TYPE_COMMENT;
        }

        $comments = $this->getByField(array(
            'id' => $ids,
            'action' => $types
        ), 'id');

        if (!$comments) {
            return array();
        }

        $comment_ids = array_keys($comments);

        $lm = new tasksTaskLogModel();
        $attachment_counters = $lm->countAttachments($comment_ids);

        foreach ($comments as &$comment) {
            $comment['attachments_count'] = $attachment_counters[$comment['id']];
            $comment['is_empty'] = strlen($comment['text']) <= 0 && $attachment_counters[$comment['id']] <= 0;
        }
        unset($comment);

        return $comments;
    }

    public function getRelatedContactIdsByProject($contact_id)
    {
        $sql = "SELECT project_id, assigned_contact_id
                FROM {$this->table}
                WHERE contact_id=?
                    AND create_datetime>=?
                    AND assigned_contact_id IS NOT NULL
                GROUP BY project_id, assigned_contact_id";
        $result = array();
        foreach($this->query($sql, (int)$contact_id, date('Y-m-d H:i:s', strtotime('-1 MONTH'))) as $row) {
            // !!! or vice versa
            $result[$row['assigned_contact_id']][$row['project_id']] = $row['project_id'];
        }
        return $result;
    }

    /**
     * @param int $contact_id
     * @param int $project_id
     * @return array
     */
    public function getRelatedContactIds($contact_id, $project_id = null)
    {
        $sql = 'SELECT assigned_contact_id
                FROM '.$this->table.'
                WHERE contact_id = i:0
                    AND create_datetime>=s:1
                    AND assigned_contact_id IS NOT NULL
                    '.($project_id ? 'AND project_id = i:2' : '').'
                GROUP BY assigned_contact_id
                ORDER BY MAX(id) DESC';
        return $this->query($sql,
            (int)$contact_id,
            date('Y-m-d H:i:s', strtotime('-1 MONTH')),
            $project_id
        )->fetchAll(null, true);
    }

    /**
     * @param int $contact_id
     * @return array
     */
    public function getRelatedProjects($contact_id)
    {
        $sql = "SELECT DISTINCT project_id, MAX(create_datetime) AS dt
                FROM tasks_task_log
                WHERE contact_id = i:0
                    AND create_datetime >= s:1
                GROUP BY project_id
                ORDER BY dt DESC";
        return array_keys($this->query($sql, (int)$contact_id, date('Y-m-d H:i:s', strtotime('-1 MONTH')))->fetchAll('project_id', true));
    }

    public function delete($id)
    {
        $params_model = new tasksTaskLogParamsModel();
        $params_model->deleteByField('task_id', $id);

        return $this->deleteById($id);
    }

    public function getData(tasksTask $task)
    {
        $logs = $this->getByTasks(array($task));
        return ifempty($logs[$task['id']], array());
    }

    public function getByTasks($tasks)
    {
        $result = array();
        foreach($tasks as $t) {
            if (wa_is_int($t['id']) && wa_is_int($t['project_id'])) {
                $result[$t['id']] = array();
            }
        }
        if (!$result) {
            return $result;
        }

        $sql = 'SELECT * FROM '.$this->table.' WHERE task_id IN (?) ORDER BY id ASC';
        $logs = $this->query($sql, array(array_keys($result)))->fetchAll('id');
        if (!$logs) {
            return $result;
        }

        self::workupLogs($logs);

        // Form the $result array: task_id => list of log records
        foreach ($logs as $log) {
            $result[$log['task_id']][$log['id']] = $log;
        }

        // Addintional log info based on previous log records of the same task
        // (e.g. whether the assignment changed)
        $empty_row = $this->getEmptyRow();
        foreach($result as $task_id => $task_logs) {
            $prev_log = $empty_row;
            foreach($task_logs as $log_id => $log) {
                $result[$task_id][$log_id]['assignment_changed']
                    = $prev_log['assigned_contact_id'] != $log['assigned_contact_id'];
                $prev_log = $log;
            }
        }

        return $result;
    }

    public static function workupLogs(&$logs, $options = array())
    {
        if (!$logs) {
            return;
        }

        // Fetch params
        $params_model = new tasksTaskLogParamsModel();
        $rows = $params_model->getByField('log_id', array_keys($logs), true);
        foreach ($rows as $row) {
            $logs[$row['log_id']]['params'][$row['name']] = $row['value'];
        }
        unset($rows);

        // Fetch contact data
        $contacts = self::getLogContacts($logs);

        $tasks = array();
        if (isset($options['tasks']) && $options['tasks'] === true) {
            $tasks = self::getLogTasks($logs);
        }

        $empty_contact = array(
            'id' => '',
            'name' => '',
            'photo_url' => '',
            'firstname' => '',
            'middlename' => '',
            'lastname' => '',
            'company' => '',
        );
        $statuses = array();

        $action_names = self::getActionsNames();

        // Modify $logs with new data
        foreach ($logs as &$log) {
            $log['contact'] = ifempty($contacts[$log['contact_id']], $empty_contact);
            $log['assigned_contact'] = ifempty($contacts[$log['assigned_contact_id']], $empty_contact);
            $log['status_changed'] = $log['before_status_id'] != $log['after_status_id'];
            $log['params'] = ifempty($log['params'], array());
            foreach ($log['params'] as $k => $v) {
                if (substr($k, -10) == 'contact_id') {
                    $log['params'][str_replace('contact_id', 'contact', $k)] = ifempty($contacts[$v], $empty_contact);
                }
            }

            $log['action_name'] = ifset($action_names[$log['action']], '');
            if (!$log['action'] && $log['status_changed']) {
                if (!isset($statuses[$log['project_id']])) {
                    $statuses[$log['project_id']] = tasksHelper::getStatuses($log['project_id'], false);
                }
                $s = ifset($statuses[$log['project_id']][$log['after_status_id']], array(
                    'name' => $log['after_status_id'],
                ));
                $log['action_name'] = ifempty($s['action_name'], $s['name']);
            }

            $log['task'] = isset($tasks[$log['task_id']]) ? $tasks[$log['task_id']] : null;
        }
    }

    public static function getActionsNames()
    {
        return array(
            self::ACTION_TYPE_CREATE => _w('created'),
            self::ACTION_TYPE_COMMENT => _w('added comment'),
            self::ACTION_TYPE_FORWARD => _w('forwarded'),
            self::ACTION_TYPE_RETURN => _w('returned'),
            self::ACTION_TYPE_EDIT => _w('edit')
        );
    }

    public static function getLogContacts($logs)
    {
        $contacts = array();
        foreach ($logs as $log) {
            if ($log['contact_id']) {
                $contacts[$log['contact_id']] = true;
            }
            if ($log['assigned_contact_id']) {
                $contacts[$log['assigned_contact_id']] = true;
            }
            if (!empty($log['params']) && is_array($log['params'])) {
                foreach ($log['params'] as $k => $v) {
                    if (substr($k, -10) == 'contact_id') {
                        $contacts[$v['value']] = true;
                    }
                }
            }
        }
        if ($contacts) {
            $collection = new waContactsCollection('id/'.implode(',', array_keys($contacts)));
            $contacts = $collection->getContacts('login,firstname,middlename,lastname,name,company,photo_url');
            foreach ($contacts as &$c) {
                $c['name'] = tasksHelper::formatName($c);
            }
            unset($c);
        }
        return $contacts;
    }

    protected static function getLogTasks($logs)
    {
        $task_ids = array();
        foreach ($logs as $log) {
            $task_ids[] = $log['task_id'];
        }
        $task_ids = array_unique($task_ids);
        if (!$task_ids) {
            return array();
        }
        $hash = 'id/' . implode(',', $task_ids);
        $collection = new tasksCollection($hash);
        return $collection->getTasks('*,project');
    }

    // helper for $this->getList() and $this->getPeriodByDate()
    protected static function getFromSQL($options)
    {
        $milestone_join = '';
        if (isset($options['milestone_id'])) {
            $milestone_join = "JOIN tasks_task AS t ON t.id=tl.task_id";
        }
        return "FROM tasks_task_log AS tl {$milestone_join}";
    }

    // helper for $this->getList() and $this->getPeriodByDate()
    protected static function getWhereSQL($options)
    {
        $contact_sql = '';
        if (!empty($options['contact_id'])) {
            $contact_sql = "AND tl.contact_id=".((int)$options['contact_id']);
        }

        $milestone_sql = '';
        if (isset($options['milestone_id'])) {
            if ($options['milestone_id']) {
                $milestone_sql = "AND t.milestone_id=".((int)$options['milestone_id']);
            } else {
                $milestone_sql = "AND t.milestone_id IS NULL";
            }
        }

        $project_sql = '';
        if (!empty($options['project_id'])) {
            $project_sql = "AND tl.project_id=".((int)$options['project_id']);
        }

        return "WHERE 1=1 {$contact_sql} {$milestone_sql} {$project_sql}";
    }

    public function getList($options, &$total_count=null)
    {
        $limit = null;
        $limit_sql = '';
        if (array_key_exists('limit', $options)) {
            $limit = (int) $options['limit'];
        } else {
            $limit = wa('tasks')->getConfig()->getOption('tasks_per_page');
        }
        if ($limit) {
            $start = ifset($options['start'], 0);
            $limit_sql = "LIMIT {$start}, {$limit}";
        }

        $sql = "SELECT SQL_CALC_FOUND_ROWS tl.*
                ".self::getFromSQL($options)."
                ".self::getWhereSQL($options)."
                ORDER BY id DESC
                {$limit_sql}";
        $logs = $this->query($sql)->fetchAll('id');
        if (!$logs) {
            $total_count = 0;
            return array();
        }
        $total_count = (int) $this->query('SELECT FOUND_ROWS()')->fetchField();
        self::workupLogs($logs, $options);

        return $logs;
    }

    public function getPeriodByDate($options)
    {
        if(empty($options['start_date']) || empty($options['end_date'])) {
            throw new waException('Time period is required.');
        }

        $date_sql = "DATE(tl.create_datetime)";
        if ($options['group_by'] == 'months') {
            $date_sql = "DATE_FORMAT(tl.create_datetime, '%Y-%m-01')";
        }

        $sql = "SELECT {$date_sql} AS `date`, after_status_id AS status_id, count(*) AS `count`
                ".self::getFromSQL($options)."
                ".self::getWhereSQL($options)."
                    AND tl.create_datetime >= ?
                    AND tl.create_datetime <= ?
                GROUP BY `date`, status_id";
        $rows = $this->query($sql, array(
            $options['start_date'],
            $options['end_date'],
        ));

        $result = array();
        foreach($rows as $row) {
            $result[$row['date']][$row['status_id']] = (int) $row['count'];
        }
        return $result;
    }

    public function getMinDate()
    {
        // !!! TODO: create index tasks_task_log.create_datetime
        $sql = "SELECT DATE(MIN(create_datetime)) FROM tasks_task_log WHERE create_datetime!='0000-00-00'";
        return $this->query($sql)->fetchField();
    }

    public function countAttachments($log_id)
    {
        $am = new tasksAttachmentModel();
        return $am->countByLogId($log_id);
    }

    public function getLast($task_id)
    {
        return $this->select('*')->where('task_id = ?', $task_id)->order('id DESC')->fetchAssoc();
    }
}
