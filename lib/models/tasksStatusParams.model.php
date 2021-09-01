<?php

class tasksStatusParamsModel extends waModel
{
    public const ASSIGN_TYPE_NO_CHANGE = '';
    public const ASSIGN_TYPE_USER      = 'user';
    public const ASSIGN_TYPE_AUTHOR    = 'author';
    public const ASSIGN_TYPE_SELECT    = 'select';

    public const ASSIGN_TYPES = [
        self::ASSIGN_TYPE_NO_CHANGE,
        self::ASSIGN_TYPE_USER,
        self::ASSIGN_TYPE_AUTHOR,
        self::ASSIGN_TYPE_SELECT,
    ];

    protected $table = 'tasks_status_params';

    public function set($status_id, $params)
    {
        $values = [];
        foreach ($params as $name => $value) {
            $values[] = [
                'name' => $name,
                'value' => $value,
                'status_id' => $status_id,
            ];
        }
        $this->deleteByField('status_id', $status_id);
        $values && $this->multipleInsert($values);
    }
}
