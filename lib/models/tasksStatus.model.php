<?php
class tasksStatusModel extends waModel
{
    public const STATUS_OPEN_ID = 0;
    public const STATUS_CLOSED_ID = -1;

    protected $table = 'tasks_status';

    public function getAll($key = null, $normalize = false)
    {
        $sql = "SELECT * FROM {$this->table} ORDER BY sort";
        return $this->query($sql)->fetchAll($key, $normalize);
    }

    /**
     * @param array $project_ids
     * @return array
     */
    public function getAvailableStatusIds($project_ids)
    {
        if (!$project_ids) {
            return array();
        }
        $sql = 'SELECT DISTINCT id FROM '.$this->table.' s
                JOIN tasks_project_statuses ps ON s.id = ps.status_id
                WHERE ps.project_id IN (i:0)';
        return $this->query($sql, array($project_ids))->fetchAll(null, true);
    }
}
