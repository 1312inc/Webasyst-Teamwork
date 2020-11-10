<?php

return array(
    'name'            => 'Export',
    'description'     => 'Export',
    'img'             => 'img/export.png',
    'version'         => '0.1',
    'vendor'          => 'webasyst',
    'custom_settings' => 0,
    'handlers'        => array(
        'backend_tasks' => 'backendTasks',
        'backend_assets' => 'backendAssets'
    ),
);
