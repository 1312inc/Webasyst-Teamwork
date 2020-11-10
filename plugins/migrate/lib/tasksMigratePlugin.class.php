<?php

class tasksMigratePlugin extends waPlugin
{

    private static $developer = false;

    public static function getTransports()
    {
        $transports = array(
            ''               => array(
                'value'       => '',
                'title'       => _wp('Select platform'),
                'description' => '',
            ),
            'webasystsame'   => array(
                'value'       => 'webasystsame',
                'title'       => _wp('WebAsyst Tasks & Projects (old version) on the same server'),
                'description' => _wp(''),
                'group'       => 'Webasyst',
            ),
            'webasystremote' => array(
                'value'       => 'webasystremote',
                'title'       => _wp('WebAsyst Tasks & Projects (old version) on a remote server'),
                'description' => '',
                'group'       => 'Webasyst',
            ),
        );

        return self::$developer ? array(
                '' => array(
                    'value'       => '',
                    'title'       => _wp('Select platform'),
                    'description' => '',
                )
            ) + tasksMigrateTransport::enumerate() : $transports;
    }
}
