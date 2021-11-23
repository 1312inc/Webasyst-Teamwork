<?php

class tasksApiEmailDto extends tasksApiExtValueAbstractDto
{
    public const EXT_WORK     = 'work';
    public const EXT_PERSONAL = 'personal';
    public const EXT_NOEXT    = '';

    public static function createFromArray(array $data): tasksApiEmailDto
    {
        return new self($data['ext'], $data['data']);
    }
}
