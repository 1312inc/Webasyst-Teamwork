<?php

return array(
    'name'            => 'Preview',
    'description'     => 'Preview',
    'img'             => 'img/preview.svg',
    'version'         => '1.0',
    'vendor'          => 'webasyst',
    'custom_settings' => 0,
    'handlers'        => array(
        'backend_task_edit' => 'backendTaskEdit',
        'backend_assets' => 'backendAssets'
    ),
);
