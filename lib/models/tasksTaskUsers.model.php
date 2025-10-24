<?php

class tasksTaskUsersModel extends waModel
{
    protected $table = 'tasks_task_users';

    public function getUsersRoleByTasks($task_ids = [])
    {
        $result = [];
        $task_ids = waUtils::toIntArray($task_ids);
        $data = $this->query("
            SELECT * FROM tasks_task_users ttu
            LEFT JOIN tasks_user_role tur ON tur.id = ttu.role_id
            WHERE ttu.task_id IN (i:task_ids)
            ORDER BY tur.sort, ttu.create_datetime DESC
        ", ['task_ids' => $task_ids])->fetchAll();

        foreach ($data as $_data) {
            unset($_data['id']);
            $result[$_data['task_id']][$_data['contact_id']][$_data['role_id']] = $_data;
        }

        return $result;
    }

    public function getRolesByContacts($contact_ids = [])
    {
        $result = [];
        $contact_ids = waUtils::toIntArray($contact_ids);
        $data = $this->query("
            SELECT * FROM tasks_task_users ttu
            LEFT JOIN tasks_user_role tur ON tur.id = ttu.role_id
            WHERE ttu.contact_id IN (i:contact_ids)
            ORDER BY ttu.contact_id, tur.sort, ttu.create_datetime DESC
        ", ['contact_ids' => $contact_ids])->fetchAll();

        foreach ($data as $_data) {
            unset($_data['id']);
            $result[$_data['task_id']][$_data['contact_id']] = $_data;
        }

        return $result;
    }

    public function addUserRole($task_id, $contact_id, $role_id)
    {
        return $this->insert([
            'task_id' => $task_id,
            'contact_id' => $contact_id,
            'role_id' => $role_id,
            'create_datetime' => date('Y-m-d H:i:s'),
        ]);
    }
}
