<?php

class tasksWidgetStat
{
    protected $projects;
    protected $scopes;
    protected $options = [];

    public function __construct($filter = [], $options = [])
    {
        if (!is_array($filter)) {
            $filter = [];
        }

        $type = isset($filter['type']) && is_scalar($filter['type']) ? $filter['type'] : '';
        if (!in_array($type, ['all', 'projects', 'scopes', true], true)) {
            $type = 'all';
        }
        $filter['type'] = $type;

        if ($type === 'projects') {
            $projects = isset($filter['projects']) && is_array($filter['projects']) ? $filter['projects'] : [];
            $projects = tasksHelper::toIntArray($projects);
            $projects = tasksHelper::dropNotPositive($projects);
            $this->projects = $projects;
        } elseif ($type === 'scopes') {
            $scopes = isset($filter['scopes']) && is_array($filter['scopes']) ? $filter['scopes'] : [];
            $scopes = tasksHelper::toIntArray($scopes);
            $scopes = tasksHelper::dropNotPositive($scopes);
            $this->scopes = $scopes;
        }
    }

    protected function buildActorsQuery($offset, $limit)
    {
        $offset = (int) $offset;
        $limit = (int) $limit;

        // get actors (assigned contacts for not closed tasks) with total count of opened tasks
        $query_builder = new tasksWidgetQueryBuilder();
        $query_builder
            ->from('tasks_task', 'task')
            ->select('`task`.`assigned_contact_id`', 'COUNT(*) AS `total_count`')
            ->groupBy('`task`.`assigned_contact_id`')
            ->orderBy('total_count DESC', '`task`.`id`')
            ->limit($offset, $limit)
            ->addWhere('`task`.`assigned_contact_id` > 0')
            ->addWhere('`task`.`status_id` > -1');


        if ($this->projects !== null) {
            if ($this->projects) {
                $query_builder->addWhere(
                    '`task`.`project_id` IN (:project_ids)',
                    'project_ids',
                    array_keys($this->projects)
                );
            } else {
                $query_builder->addWhere(0);
            }
        }

        if ($this->scopes !== null) {
            if ($this->scopes) {
                $query_builder
                    ->addJoin('`tasks_milestone` `milestone` ON `milestone`.`id` = `task`.`milestone_id`')
                    ->addWhere(
                        '`milestone`.`id` IN (:scope_ids)',
                        'scope_ids',
                        array_keys($this->scopes)
                    );
            } else {
                $query_builder->addWhere(0);
            }

        }

        $query = $query_builder->getQuery();
        $bind_params = $query_builder->getParams();

        return [$query, $bind_params];
    }

    protected function buildOverdueQuery($contact_ids)
    {
        // build sql peace for express overdue fact
        // task is overdue if overdue by task.due_date OR overdue by milestone.due_date
        $overdue_exp = "DATEDIFF(`:alias`.`due_date`, NOW()) < 0";
        $overdue_exp_task = str_replace(':alias', 'task', $overdue_exp);
        $overdue_exp_milestone = str_replace(':alias', 'milestone', $overdue_exp);
        $overdue_where = "{$overdue_exp_task} OR (`milestone`.`id` IS NOT NULL AND {$overdue_exp_milestone})";

        // get the same actors with counters of overdue tasks
        $query_builder = new tasksWidgetQueryBuilder();
        $query_builder
            ->from('tasks_task', 'task')
            ->select('`task`.`assigned_contact_id`', 'COUNT(*) AS `count`')
            ->addJoin('`tasks_milestone` `milestone` ON `milestone`.`id` = `task`.`milestone_id`', true)
            ->groupBy('`task`.`assigned_contact_id`')
            ->addWhere('`task`.`assigned_contact_id` IN (:contact_ids)', 'contact_ids', $contact_ids)
            ->addWhere('`task`.`status_id` > -1')
            ->addWhere($overdue_where);

        if ($this->projects !== null) {
            if ($this->projects) {
                $query_builder->addWhere(
                    '`task`.`project_id` IN (:project_ids)',
                    'project_ids',
                    array_keys($this->projects)
                );
            } else {
                $query_builder->addWhere(0);
            }
        }
        if ($this->scopes !== null) {
            if ($this->scopes) {
                $query_builder
                    ->addWhere(
                        '`milestone`.`id` IN (:scope_ids)',
                        'scope_ids',
                        array_keys($this->scopes)
                    );
            } else {
                $query_builder->addWhere(0);
            }

        }

        $query = $query_builder->getQuery();
        $bind_params = $query_builder->getParams();

        return [$query, $bind_params];
    }

    public function getStat($offset, $limit)
    {
        $tm = new tasksTaskModel();

        $offset = (int) $offset;
        $limit = (int) $limit;

        [$query, $bind_params] = $this->buildActorsQuery($offset, $limit);
        $stats = $tm->query($query, $bind_params)->fetchAll('assigned_contact_id');

        $contact_ids = array_keys($stats);
        if (!$contact_ids) {
            return [];
        }

        [$query, $bind_params] = $this->buildOverdueQuery($contact_ids);
        $overdue_stats = $tm->query($query, $bind_params)->fetchAll('assigned_contact_id');

        $activeContactIds = (new tasksTaskLogModel())->getContactIds();
        $userId = wa()->getUser()->getId();
        foreach ($stats as $contactId => &$item) {
            if (!in_array($contactId, $activeContactIds) || $contactId == $userId) {
                unset($stats[$contactId]);
                continue;
            }

            $contact = new waContact($contactId);
            if ($contact['is_user'] == -1) {
                unset($stats[$contactId]);
                continue;
            }

            $item['overdue_count'] = 0;
            if (isset($overdue_stats[$item['assigned_contact_id']])) {
                $item['overdue_count'] = $overdue_stats[$item['assigned_contact_id']]['count'];
            }
        }
        unset($item);

        return $stats;
    }

    protected function buildMaxCountQuery()
    {
        // get max from total_counters of all actors
        // will need for calculate percentage rate

        $query_builder = new tasksWidgetQueryBuilder();
        $query_builder
            ->from('tasks_task', 'task')
            ->select('COUNT(*) AS `count`')
            ->addWhere('`task`.`status_id` > -1')
            ->groupBy('`task`.`assigned_contact_id`');

        if ($this->projects !== null) {
            if ($this->projects) {
                $query_builder->addWhere(
                    '`task`.`project_id` IN (:project_ids)',
                    'project_ids',
                    array_keys($this->projects)
                );
            } else {
                $query_builder->addWhere(0);
            }
        }
        if ($this->scopes !== null) {
            if ($this->scopes) {
                $query_builder
                    ->addJoin('`tasks_milestone` `milestone` ON `milestone`.`id` = `task`.`milestone_id`')
                    ->addWhere(
                        '`milestone`.`id` IN (:scope_ids)',
                        'scope_ids',
                        array_keys($this->scopes)
                    );
            } else {
                $query_builder->addWhere(0);
            }

        }

        $query = $query_builder->getQuery();
        $query = "SELECT MAX(`t`.`count`) FROM($query) `t`";

        $bind_params = $query_builder->getParams();

        return [$query, $bind_params];
    }


    public function calcMaxCount()
    {
        $tm = new tasksTaskModel();
        [$query, $bind_params] = $this->buildMaxCountQuery();

        return $tm->query($query, $bind_params)->fetchField();
    }
}
