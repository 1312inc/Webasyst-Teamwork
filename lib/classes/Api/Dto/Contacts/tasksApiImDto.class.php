<?php

class tasksApiImDto extends tasksApiExtValueAbstractDto
{
    public const EXT_WHATSAPP = 'whatsapp';
    public const EXT_TELEGRAM = 'telegram';
    public const EXT_SIGNAL   = 'signal';
    public const EXT_VIBER    = 'viber';
    public const EXT_FACEBOOK = 'facebook';
    public const EXT_SKYPE    = 'skype';
    public const EXT_WECHAT   = 'wechat';
    public const EXT_IMESSAGE = 'imessage';
    public const EXT_LINE     = 'line';
    public const EXT_QQ       = 'qq';
    public const EXT_ICQ      = 'icq';

    public static function createFromArray(array $data): tasksApiImDto
    {
        return new self($data['ext'], $data['data']);
    }
}
