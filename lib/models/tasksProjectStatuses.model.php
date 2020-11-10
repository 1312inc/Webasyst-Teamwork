<?php
class tasksProjectStatusesModel extends waModel
{
    protected $table = 'tasks_project_statuses';

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
            $sql = 'SELECT *
                    FROM '.$this->table.' ps
                    WHERE ps.project_id IN (?)';
            foreach($this->query($sql, array(array_keys($project_ids))) as $row) {
                self::$cache_by_project[$row['project_id']][] = $row['status_id'];
                $result[$row['project_id']][] = $row['status_id'];
            }
        }

        if (is_array($id_or_ids)) {
            return $result;
        } else {
            return $result[$id_or_ids];
        }
    }

    public function getStatuses($project_id)
    {
        // Get all statuses with their params and stuff
        $statuses = tasksHelper::getStatuses(null, false);

        // Mark statuses enabled in this project
        foreach($this->getByProject((int)$project_id) as $status_id) {
            if (!empty($statuses[$status_id])) {
                $statuses[$status_id]['enabled'] = 1;
            }
        }

        // Remove statuses disabled in this project
        foreach($statuses as $k => $v) {
            if ($k > 0 && empty($v['enabled'])) {
                unset($statuses[$k]);
            } else {
                unset($statuses[$k]['enabled']);
            }
        }

        // Fetch project-specific status params
        $project_status_params_model = new tasksProjectStatusParamsModel();
        foreach($project_status_params_model->getByProject($project_id) as $status_id => $params) {
            if (!empty($statuses[$status_id])) {
                $statuses[$status_id]['params'] = $params;
            }
        }

        return $statuses;
    }

    public function setStatuses($project_id, $status_ids)
    {
        $this->deleteByField('project_id', $project_id);
        $values = array();
        foreach($status_ids as $status_id) {
            $values[] = array(
                'project_id' => $project_id,
                'status_id' => $status_id,
            );
        }
        $values && $this->multipleInsert($values);
    }
}

