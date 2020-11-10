<?php

class tasksReleasesPluginScopeGraph
{
    protected $options = array();
    protected $scope;
    protected $tm;

    public function __construct($scope, $options = array())
    {
        if (is_array($scope) && isset($scope['id'])) {
            $this->scope = $scope;
        } else {
            throw new waException('Scope is undefined');
        }
        $this->options = $options;
        $this->tm = new tasksTaskModel();
    }

    public function getData()
    {
        $raw_graph_data = $this->getRawData();
        if (!$raw_graph_data) {
            return array();
        }

        $ttm = new tasksReleasesPluginTaskTypesModel();
        $types = $ttm->getTypes();
        foreach ($raw_graph_data as &$item) {
            $item['name'] = '';
            $item['color'] = tasksReleasesPluginTaskTypesModel::DEFAULT_COLOR;
            $type = isset($types[$item['type']]) ? $types[$item['type']] : null;
            if ($type) {
                $item['color'] = $type['color'];
                $item['name'] = $type['name'];
            }
        }
        unset($item);

        // Fix start point for all graph
        $min_date = null;

        // Grouping by type
        $type_ids = waUtils::getFieldValues($types, 'id');
        $graph = array_fill_keys($type_ids, array());
        foreach ($raw_graph_data as $item) {
            $type = $item['type'];
            $graph[$type] = (array)ifset($graph[$type]);

            $graph[$type]['type'] = $item['type'];
            $graph[$type]['name'] = $item['name'];
            $graph[$type]['color'] = $item['color'];
            $graph[$type]['data'] = (array)ifset($graph[$type]['data']);
            unset($item['type'], $item['color'], $item['name']);
            $graph[$type]['data'][$item['date']] = $item;

            if ($min_date === null) {
                $min_date = $item['date'];
            } elseif ($this->compareDates($item['date'], $min_date) < 0) {
                $min_date = $item['date'];
            }
        }

        foreach ($graph as $type_id => $item) {
            if (empty($graph[$type_id])) {
                unset($graph[$type_id]);
            }
        }

        $today = date('Y-m-d');

        // Day sampling
        foreach ($graph as $type_id => &$type_data) {

            $data = $type_data['data'];
            $type_data['data'] = array();   // will be refilled to ensure correct order

            $start_date = $min_date;
            $end_date = $today;
            while ($this->compareDates($start_date, $end_date) <= 0) {
                if (!isset($data[$start_date])) {
                    $type_data['data'][$start_date] = array(
                        'date' => $start_date,
                        'count' => 0
                    );
                } else {
                    $type_data['data'][$start_date] = $data[$start_date];
                }

                $start_date = $this->dateInc($start_date);
                if ($start_date === false) {
                    break;
                }
            }

            $type_data['data'] = array_values($type_data['data']);
        }
        unset($type_data);

        $graph = array_values($graph);

        return $graph;
    }

    protected function getRawData()
    {
        $min_date = $this->getMinDate();
        $max_date = $this->getMaxDate();
        $days_diff = tasksHelper::calcDatesDiffInDays($max_date, $min_date);
        $months_diff = $days_diff / 30;

        // bound by 6 months if need
        if ($months_diff >= 6) {
            $start_date = date('Y-m-d', strtotime('-6 months'));
            $query = $this->buildGraphDataQuery($start_date);
        } else {
            $query = $this->buildGraphDataQuery();
        }

        $raw_graph_data = $this->tm->query($query->getQuery(), $query->getParams())->fetchAll();
        return $raw_graph_data ? $raw_graph_data : array();
    }

    /**
     * @return bool|mixed
     */
    protected function getMinDate()
    {
        $query = $this->buildMinDateQuery();
        return $this->tm->query($query->getQuery(), $query->getParams())->fetchField();
    }

    /**
     * @return bool|mixed
     */
    protected function getMaxDate()
    {
        $query = $this->buildMaxDateQuery();
        return $this->tm->query($query->getQuery(), $query->getParams())->fetchField();
    }

    /**
     * @return tasksReleasesPluginQueryBuilder
     */
    protected function buildMinDateQuery()
    {
        $builder = $this->prepareQuery();
        $query = $builder->select('MIN(DATE(`tt`.`create_datetime`))');
        return $query;
    }

    /**
     * @return tasksReleasesPluginQueryBuilder
     */
    protected function buildMaxDateQuery()
    {
        $builder = $this->prepareQuery();
        return $builder->select('MAX(DATE(`tt`.`create_datetime`))');
    }

    /**
     * @return tasksReleasesPluginQueryBuilder
     * @param string|null $start_date
     */
    protected function buildGraphDataQuery($start_date = null)
    {
        $builder = $this->prepareQuery();
        $query = $builder
            ->select('`te`.`type`, DATE(`tt`.`create_datetime`) AS `date`, COUNT(*) AS `count`')
            ->groupBy('`te`.`type`, DATE(`tt`.`create_datetime`)')
            ->orderBy('DATE(`tt`.`create_datetime`)');
        if ($start_date !== null) {
            $query->addWhere('DATE(`tt`.`create_datetime`) > :start_date', 'start_date', $start_date);
        }
        return $query;
    }

    /**
     * @return tasksReleasesPluginQueryBuilder
     */
    protected function prepareQuery()
    {
        $builder = new tasksReleasesPluginQueryBuilder();
        return $builder
            ->from('tasks_task', 'tt')
            ->addJoin('tasks_releases_task_ext', 'te', '`tt`.`id` = `te`.`task_id`')
            ->addWhere('`tt`.`milestone_id` = :scope_id', 'scope_id', $this->scope['id']);
    }

    protected function prepareQuery2()
    {
        $builder = new tasksReleasesPluginQueryBuilder();
        return $builder
            ->from('tasks_task', 'tt')
            ->addJoin('tasks_releases_task_ext', 'te', '`tt`.`id` = `te`.`task_id`')
            ->addWhere('`tt`.`milestone_id` = :scope_id', 'scope_id', $this->scope['id'])
            ->groupBy('`te`.`type`, DATE(`tt`.`create_datetime`)')
            ->orderBy('DATE(`tt`.`create_datetime`)');
        /*
        $sql = "SELECT `te`.`type`, DATE(`tt`.`create_datetime`) AS `date`, COUNT(*) AS `count` 
                FROM `tasks_task` `tt`
                JOIN `tasks_releases_task_ext` `te` ON `tt`.`id` = `te`.`task_id`
                WHERE `tt`.`milestone_id` = ?
                GROUP BY `te`.`type`, `date`
                ORDER BY `date`";*/
    }

    protected function compareDates($date1, $date2)
    {
        $days_diff = tasksHelper::calcDatesDiffInDays($date1, $date2);
        if ($days_diff === 0 || $days_diff === false) {
            return 0;
        }
        return $days_diff > 0 ? 1 : -1;
    }

    /**
     * @param $date
     * @return bool|false|string
     */
    protected function dateInc($date)
    {
        $ts = strtotime($date);
        if ($ts === false || $date < 0) {
            return false;
        }
        $ts = strtotime('+1 day', $ts);
        $date = date('Y-m-d', $ts);
        return $date;
    }
}
