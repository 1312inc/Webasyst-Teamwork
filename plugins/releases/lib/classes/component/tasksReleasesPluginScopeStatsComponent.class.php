<?php

class tasksReleasesPluginScopeStatsComponent extends tasksReleasesPluginComponent
{
    protected $scope;
    protected $model;
    protected $tm;

    public function __construct($id)
    {
        $this->model = new tasksMilestoneModel();
        $this->scope = $this->model->getById($id);
        $this->tm = new tasksTaskModel();
    }

    public function getStatsBlock()
    {
        if (!$this->scope) {
            return '';
        }

        $scope = $this->scope;
        $scopes = array($scope['id'] => $scope);
        tasksMilestoneModel::workup($scopes);
        $scope = reset($scopes);

        $assign = array(
            'total_count' => $this->getTotalCount(),
            'statuses' => $this->getStatuses(),
            'scope' => $scope,
            'create_datetime' => $this->getCreateDatetime(),
            'assigned_users' => $this->getAssignedUsers(),
            'time_costs' => $this->getTimeCosts(),
            'graph' => $this->getGraph(),
        );
        return $this->render("scope/stats.html", $assign);
    }

    protected function getStatuses()
    {
        return $this->model->getMilestoneStatuses($this->scope['id']);
    }

    protected function getTotalCount()
    {
        return $this->tm->countByField('milestone_id', $this->scope['id']);
    }

    protected function getCreateDatetime()
    {
        return $this->tm->select('create_datetime')
            ->where('milestone_id = ?', $this->scope['id'])
            ->order('create_datetime DESC')
            ->limit(1)
            ->fetchField();
    }

    protected function getAssignedUsers()
    {
        $sql = "SELECT `assigned_contact_id`, COUNT(*) 
                FROM `tasks_task` 
                WHERE milestone_id = ? AND status_id > -1
                GROUP BY `assigned_contact_id`";

        $result = $this->tm->query($sql, $this->scope['id'])->fetchAll('assigned_contact_id', true);

        $contact_ids = array_keys($result);
        if (!$contact_ids) {
            return array();
        }
        $col = new waContactsCollection('id/' . join(',', $contact_ids));
        $contacts = $col->getContacts('id,name,photo_url_20');

        foreach ($contacts as &$contact) {
            $contact['count'] = 0;
            if (isset($result[$contact['id']])) {
                $contact['count'] = $result[$contact['id']];
            }
        }
        unset($contact);

        return $contacts;
    }

    protected function getTimeCosts()
    {
        $stats = array(
            'plan' => array(
                'opened' => $this->getConcreteTimeCosts('timecosts_plan', 'opened'),
                'closed' => $this->getConcreteTimeCosts('timecosts_plan', 'closed')
            ),
            'fact' => array(
                'opened' => $this->getConcreteTimeCosts('timecosts_fact', 'opened'),
                'closed' => $this->getConcreteTimeCosts('timecosts_fact', 'closed'),
            )
        );
        $stats['plan']['total'] = $stats['plan']['opened'] + $stats['plan']['closed'];
        $stats['fact']['total'] = $stats['fact']['opened'] + $stats['fact']['closed'];
        return $stats;
    }

    protected function getConcreteTimeCosts($field, $pseudo_status)
    {
        if ($pseudo_status === 'opened') {
            $where = '`tt`.`status_id` <= -1';
        } else {
            $where = '`tt`.`status_id` > -1';
        }
        return $this->model->query("
            SELECT SUM(`te`.`{$field}`) 
            FROM `tasks_task` `tt`
            JOIN `tasks_releases_task_ext` `te` ON `tt`.`id` = `te`.`task_id`
            WHERE {$where} AND `tt`.`milestone_id` = ? AND `te`.`{$field}` IS NOT NULL
        ", $this->scope['id'])->fetchField();
    }

    protected function getGraph()
    {
        $graph = new tasksReleasesPluginScopeGraph($this->scope);
        return $graph->getData();
    }
}
