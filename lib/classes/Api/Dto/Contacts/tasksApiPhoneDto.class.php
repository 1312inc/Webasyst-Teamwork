<?php

class tasksApiPhoneDto extends tasksApiExtValueAbstractDto
{
    public const EXT_WORK   = 'work';
    public const EXT_MOBILE = 'mobile';
    public const EXT_HOME   = 'home';

    public static function createFromArray(array $data): tasksApiPhoneDto
    {
        return new self($data['ext'], $data['value']);
    }
}
