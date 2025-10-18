<?php

class tasksTaskModel extends waModel
{
    protected $table = 'tasks_task';

    /**
     * @param array $data
     *
     * @return array
     * @throws waException
     */
    public function add($data)
    {
        if (empty($data['project_id'])) {
            throw new waException('Project required');
        }
        $project_model = new tasksProjectModel();
        $project = $project_model->getById($data['project_id']);
        if (!$project) {
            throw new waException('Project not found');
        }

        if (empty($data['create_contact_id'])) {
            $data['create_contact_id'] = wa()->getUser()->getId();
        }
        $data['update_datetime'] = $data['create_datetime'] = date('Y-m-d H:i:s');
        $data['number'] = $project['tasks_number'] + 1;
        if (isset($data['assigned_contact_id']) && !$data['assigned_contact_id']) {
            $data['assigned_contact_id'] = null;
        }
        if (!isset($data['name'])) {
            $data['name'] = '';
        }

        if (isset($data['milestone_id']) && wa_is_int($data['milestone_id'])) {
            $data['milestone_id'] = (int) $data['milestone_id'];
        } else {
            $data['milestone_id'] = null;
        }

        $task_id = 0;
        try {
            $task_id = $this->insert($data);
        } catch (waException $exception) {
            // "Query Error 1062: Duplicate entry '(.*)' for key 'project_number'"
            if ($exception->getCode() === 1062) {
                $project_model->recountTasksNumber($project['id']);
                $project = $project_model->getById($data['project_id']);
                $data['number'] = $project['tasks_number'] + 1;
                $task_id = $this->insert($data);
            }
        }

        if (!$task_id) {
            return null;
        }

        $project_model->recountTasksNumber($project['id']);

        return $this->getById($task_id);
    }

    public function update($id, $data)
    {
        $task = $this->getById($id);
        if (!$task) {
            return false;
        }

        $project_id = null;

        if (isset($data['project_id'])) {
            $project_id = $data['project_id'];
            unset($data['number']);
            unset($data['project_id']);
        }

        if (isset($data['assigned_contact_id']) && !$data['assigned_contact_id']) {
            $data['assigned_contact_id'] = null;
        }

        $success = $this->updateById($id, $data);
        if (!$success) {
            return false;
        }

        if ($project_id) {
            $changed = $this->changeProject($id, $task['project_id'], $project_id);
            if ($changed) {
                $log_model = new tasksTaskLogModel();
                $log_model->updateByField('task_id', $id, ['project_id' => $project_id]);
            }
        }

        return true;

    }

    protected function changeProject($task_id, $old_project_id, $new_project_id)
    {
        if ($old_project_id == $new_project_id) {
            return false;
        }

        $project_model = new tasksProjectModel();
        $new_project = $project_model->getById($new_project_id);
        if (!$new_project) {
            return false;
        }

        // keeping fresh tasks_number
        $number = $new_project['tasks_number'] + 1;
        $this->updateById(
            $task_id,
            [
                'project_id' => $new_project_id,
                'number' => $number,
            ]
        );

        $project_model->recountTasksNumber($new_project_id);

        return true;

    }

    public function updateById($id, $data, $options = null, $return_object = false)
    {
        if (array_key_exists('update_datetime', $data)) {
            if (!$data['update_datetime']) {
                unset($data['update_datetime']);
            }
        } else {
            $data['update_datetime'] = date('Y-m-d H:i:s');
        }

        if (array_key_exists('milestone_id', $data)) {
            if (wa_is_int($data['milestone_id'])) {
                $data['milestone_id'] = (int) $data['milestone_id'];
            } else {
                $data['milestone_id'] = null;
            }
        }

        return parent::updateById($id, $data, $options, $return_object);
    }


    public function delete($ids)
    {
        $ids = (array) $ids;

        foreach ($ids as $id) {
            try {
                waFiles::delete(tasksHelper::getTaskPath($id, false));
            } catch (waException $e) {
            }
        }

        foreach ([
                     new tasksAttachmentModel(),
                     new tasksTaskLogModel(),
                     new tasksTaskLogParamsModel(),
                 ] as $model) {
            /**
             * @var waModel $model
             */
            $model->deleteByField('task_id', $ids);
        }

        return $this->deleteById($ids);
    }

    /** Count favorite tasks of current user: total and highext priority  */
    public function getFavoritesCounts()
    {
        $result = [
            'count' => 0,
            'total' => 0,
            'unread' => 0,
            'unread_total' => 0,
            'text_color' => '#999',
            'bg_color' => 'transparent',
            'value' => -100500,
        ];
        $priorities = tasksOptions::getTasksPriorities();
        $sql = "SELECT t.priority, count(*) AS `count`, SUM(IF(f.unread, 1, 0)) AS `unread`
                FROM {$this->table} AS t
                    JOIN tasks_favorite AS f
                        ON t.id=f.task_id
                WHERE t.status_id > -1
                    AND f.contact_id=?
                GROUP BY t.priority";
        foreach ($this->query($sql, wa()->getUser()->getId()) as $row) {
            if (empty($priorities[$row['priority']])) {
                continue;
            }
            if ($result['value'] < $row['priority']) {
                $result = $priorities[$row['priority']] + $row + $result;
            }

            $result['total'] += $row['count'];
            $result['unread_total'] += $row['unread'];
        }

        return $result;
    }

    /** Count assigned tasks for all users: total and highest priority. */
    public function getTeamCounts()
    {
        // For the purpose of sidebar counts we only differentiate
        // between urgent=2 and onfire=3 and everything else being normal=0.
        $priority_field = "IF(t.priority>=2, 2, 0)";

        $data_1 = $this->query("
            SELECT t.assigned_contact_id, $priority_field AS priority, count(*) AS `count`, t.project_id
            FROM {$this->table} t 
            JOIN tasks_project p ON t.project_id = p.id
            WHERE t.status_id > -1 AND p.archive_datetime IS NULL
            GROUP BY t.assigned_contact_id, $priority_field, t.project_id
            ORDER BY t.assigned_contact_id, $priority_field
        ")->fetchAll();

        // For role users
        $data_2 = $this->query("
            SELECT tu.contact_id AS assigned_contact_id, $priority_field AS priority, count(*) AS `count`, t.project_id
            FROM tasks_task_users tu
            LEFT JOIN tasks_user_role ur ON ur.id = tu.role_id AND ur.show_inbox <> 0
            LEFT JOIN tasks_task t ON t.id = tu.task_id
            JOIN tasks_project p ON t.project_id = p.id
            WHERE t.status_id > -1 AND p.archive_datetime IS NULL
            GROUP BY tu.contact_id, $priority_field, t.project_id
            ORDER BY tu.contact_id, $priority_field
        ")->fetchAll();



        return array_merge($data_1, $data_2);
    }

    /**
     * Get count open and closed task on scopes
     *
     * @return array
     */
    public function getCountTasksInScope()
    {
        $priority_field = "IF(t.priority>=2, 2, 0)";

        $priorities = tasksOptions::getTasksPriorities();
        $rows = $this->query(
            "SELECT t.milestone_id AS milestone_id,
                    $priority_field AS priority,
                    SUM(IF(status_id<0, 1, 0)) AS closed,
                    count(*) AS total
             FROM tasks_task AS t
             WHERE milestone_id > 0
             GROUP BY milestone_id, priority"
        );

        $result = [];
        foreach($rows as $row) {
            $milestone_id = $row['milestone_id'];
            $priority_data = ifset($priorities, $row['priority'], reset($priorities));
            $priority = $priority_data['value'];

            if (empty($result[$milestone_id])) {
                $result[$milestone_id] = $priority_data + [
                    'milestone_id' => $milestone_id,
                    'closed' => 0, // number of closed tasks attached to milestone
                    'total' => 0, // total number of tasks attacked to a milestone
                    'count' => 0, // number of open tasks in most urgent priority with at least one open
                ];
            }

            if ($row['total'] > $row['closed']) {
                if ($result[$milestone_id]['value'] < $priority) {
                    // found priority more urgent than last known
                    $result[$milestone_id] = $priority_data + $result[$milestone_id];
                    $result[$milestone_id]['count'] = $row['total'] - $row['closed'];
                } else if ($result[$milestone_id]['value'] == $priority) {
                    // same level of priority as last known
                    $result[$milestone_id]['count'] += $row['total'] - $row['closed'];
                }
            }

            $result[$milestone_id]['total'] += $row['total'];
            $result[$milestone_id]['closed'] += $row['closed'];
        }

        return $result;
    }

    /**
     * @param string $q
     * @param int    $limit
     * @param false  $full
     *
     * @return array
     */
    public function getAutocomplete($q, $limit, $full = false, $offset = 0)
    {
        $q = $this->escape($q, 'like');

        if ($full) {
            $q = '%' . $q . '%';
        } else {
            $q .= "%";
        }

        $sql = sprintf(
            "SELECT t.*
                FROM %s AS t
                WHERE concat(t.project_id, '.', t.number, t.name)  LIKE '%s'
                ORDER BY t.id ASC
                LIMIT %d, %d",
            $this->table,
            $q,
            $offset,
            $limit
        );

        return $this->query($sql)->fetchAll();
    }

    public function getWithoutUuid($limit = 100)
    {
        return $this->select('*')
            ->where('uuid is null')
            ->limit($limit)
            ->order('id desc')
            ->fetchAll();
    }
}
