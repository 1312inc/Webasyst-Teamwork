<?php

class tasksSupervisorModel extends waModel
{
    protected $table = 'tasks_supervisor';
    protected $id = array('contact_id', 'task_id');

    /**
     * @param int $task_id
     * @param array $contact_ids
     */
    public function save($task_id, $contact_ids)
    {
        $old_contact_ids = $this->select('contact_id')->where('task_id = '.(int)$task_id)->fetchAll(null, true);

        if ($old_contact_ids) {
            $delete_ids = array_diff($old_contact_ids, $contact_ids);
            $this->deleteByField(array('task_id' => $task_id, 'contact_id' => $delete_ids));
        }

        foreach ($contact_ids as $contact_id) {
            $this->insert(array('task_id' => $task_id, 'contact_id' => $contact_id), 2);
        }
    }

    public function countByContact($contact_id)
    {
        $sql = "SELECT COUNT(*)
                FROM {$this->table} AS s
                    JOIN tasks_task AS t
                        ON t.id=s.task_id
                WHERE t.status_id >= 0
                    AND s.contact_id IN (?)";
        return $this->query($sql, array((array)$contact_id))->fetchField();
    }
}