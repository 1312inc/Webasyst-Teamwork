<?php

return array(
    'name'            => 'Export',
    'description'     => 'Export',
    'img'             => 'img/export.svg',
    'version'         => '1.0',
    'vendor'          => 'webasyst',
    'custom_settings' => 0,
    'handlers'        => array(
        'backend_tasks' => 'backendTasks',
        'backend_assets' => 'backendAssets'
    ),
);
