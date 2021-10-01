<?php

class tasksApiSocialnetworkDto extends tasksApiExtValueAbstractDto
{
    public const EXT_FACEBOOK  = 'facebook';
    public const EXT_INSTAGRAM = 'instagram';
    public const EXT_TIKTOK    = 'tiktok';
    public const EXT_TWITTER   = 'twitter';
    public const EXT_LINKEDIN  = 'linkedin';
    public const EXT_VKONTAKTE = 'vkontakte';

    public static function createFromArray(array $data): tasksApiSocialnetworkDto
    {
        return new self($data['ext'], $data['data']);
    }
}
