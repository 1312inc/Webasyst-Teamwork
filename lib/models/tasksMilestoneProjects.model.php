<?php

class tasksMilestoneProjectsModel extends waModel
{
    protected $table = 'tasks_milestone_projects';

    public function getMilestonesByProjectId($project_id)
    {
        if (!$project_id) {
            return [];
        }
        $sql = "SELECT m.*
                FROM tasks_milestone AS m
                    JOIN {$this->table} AS mp
                        ON mp.milestone_id=m.id
                WHERE mp.project_id IN (?)
                    AND m.closed = 0
                ORDER BY IFNULL(due_date, '9999-12-31 23:59:59') ASC";

        return $this->query($sql, [$project_id])->fetchAll('id');
    }

    public function getRelatedProjectIds($id)
    {
        $ids = is_scalar($id) ? (array)$id : $id;
        $ids = is_array($ids) ? $ids : array();
        if (!$ids) {
            return array();
        }

        $result = array_fill_keys($ids, array());
        foreach ($this->getByField('milestone_id', $id, true) as $item) {
            $result[$item['milestone_id']][] = $item['project_id'];
        }

        return is_scalar($id) ? $result[$id] : $result;
    }

    public function saveRelatedProjects($id, $project_ids)
    {
        $ids = is_scalar($id) ? (array)$id : $id;
        $ids = is_array($ids) ? $ids : array();
        if (!$ids) {
            return array();
        }

        $project_ids = is_scalar($project_ids) ? (array)$project_ids : $project_ids;
        $project_ids = is_array($project_ids) ? $project_ids : array();

        $this->deleteByField('milestone_id', $ids);

        $insert = array();
        foreach ($ids as $id) {
            foreach ($project_ids as $project_id) {
                $insert[] = array('milestone_id' => $id, 'project_id' => $project_id);
            }
        }
        $insert && $this->multipleInsert($insert);
    }
}
