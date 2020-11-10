<?php
class tasksStatusParamsModel extends waModel
{
    protected $table = 'tasks_status_params';

    public function set($status_id, $params)
    {
        $values = array();
        foreach ($params as $name => $value) {
            $values[] = array(
                'name' => $name,
                'value' => $value,
                'status_id' => $status_id,
            );
        }
        $this->deleteByField('status_id', $status_id);
        $values && $this->multipleInsert($values);
    }
}
