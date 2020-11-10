<?php
class tasksProjectStatusParamsModel extends waModel
{
    protected $table = 'tasks_project_status_params';

    protected static $cache_by_project = array();

    public function getByProject($id_or_ids)
    {
        $result = array();
        $project_ids = array_fill_keys((array) $id_or_ids, true);
        foreach($project_ids as $id => $_) {
            if (isset(self::$cache_by_project[$id])) {
                $result[$id] = self::$cache_by_project[$id];
                unset($project_ids[$id]);
            } else {
                self::$cache_by_project[$id] = array();
                $result[$id] = array();
            }
        }

        if ($project_ids) {
            $rows = $this->getByField('project_id', array_keys($project_ids), true);
            foreach($rows as $row) {
                self::$cache_by_project[$row['project_id']][$row['status_id']][$row['name']] = $row['value'];
                $result[$row['project_id']][$row['status_id']][$row['name']] = $row['value'];
            }
        }

        if (is_array($id_or_ids)) {
            return $result;
        } else {
            return $result[$id_or_ids];
        }
    }
}
