<?php

return array(
    'name'            => 'Templates',
    'description'     => 'Speeds up task creation and assignment',
    'img'             => 'img/templates.png',
    'version'         => '1.1.0',
    'vendor'          => '1021997',
    'custom_settings' => 0,
    'handlers'        => array(
        'backend_sidebar'   => 'backendSidebar',
        'backend_assets'    => 'backendAssets',
        'backend_task_edit' => 'backendTaskEdit'
    ),
);
