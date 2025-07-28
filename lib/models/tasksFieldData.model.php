<?php

class tasksFieldDataModel extends waModel
{
    protected $table = 'tasks_field_data';

    public function getData($task_id)
    {
        $result = [];
        $data = $this->select('*')->where('task_id = ?', $task_id)->fetchAll();
        foreach ($data as $row) {
            $result[$row['field_id']] = $row['value'];
        }

        return $result;
    }

    public function save($task_id, $fields_data)
    {
        if (empty($task_id) || empty($fields_data)) {
            return false;
        }

        $insert = [];
        foreach ($fields_data as $field_id => $value) {
            $insert[] = [
                'task_id'  => (int) $task_id,
                'field_id' => (int) $field_id,
                'value'    => (string) $value
            ];
        }

        $this->deleteByField('task_id' , $task_id);
        return $this->multipleInsert($insert);
    }
}
