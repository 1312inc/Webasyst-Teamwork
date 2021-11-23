<?php

class tasksApiAddressDto extends tasksApiExtValueAbstractDto
{
    public const EXT_WORK     = 'work';
    public const EXT_SHIPPING = 'shipping';
    public const EXT_BILLING  = 'billing';
    public const EXT_HOME     = 'home';

    public static function createFromArray(array $data): tasksApiAddressDto
    {
        return new self($data['ext'], $data['value']);
    }
}
