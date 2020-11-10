<?php

return array(
    'name'            => 'Preview',
    'description'     => 'Preview',
    'img'             => 'img/preview.png',
    'version'         => '0.1',
    'vendor'          => 'webasyst',
    'custom_settings' => 0,
    'handlers'        => array(
        'backend_task_edit' => 'backendTaskEdit',
        'backend_assets' => 'backendAssets'
    ),
);
