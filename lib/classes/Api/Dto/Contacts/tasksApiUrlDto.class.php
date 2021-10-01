<?php

class tasksApiUrlDto extends tasksApiExtValueAbstractDto
{
    public const EXT_WORK     = 'work';
    public const EXT_PERSONAL = 'personal';

    public static function createFromArray(array $data): tasksApiUrlDto
    {
        return new self($data['ext'], $data['data']);
    }
}
