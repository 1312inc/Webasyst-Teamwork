<?php

class tasksTypeFieldModel extends waModel
{
    protected $table = 'tasks_type_fields';

    public function get()
    {
        $result = [];
        $items = $this->getAll();
        foreach ($items as $_item) {
            if (empty($result[$_item['field_id']])) {
                $result[$_item['field_id']] = [];
            }
            $result[$_item['field_id']][] = $_item['type_id'];
        }

        return $result;
    }

    public function save($item)
    {
        $this->truncate();
        $db_result = $this->multipleInsert($item);

        return $db_result->result();
    }
}
