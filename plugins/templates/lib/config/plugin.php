<?php

return array(
    'name'            => 'Templates',
    'description'     => 'Templates',
    'img'             => 'img/templates.png',
    'version'         => '0.1',
    'vendor'          => 'webasyst',
    'custom_settings' => 0,
    'handlers'        => array(
        'backend_sidebar'   => 'backendSidebar',
        'backend_assets'    => 'backendAssets',
        'backend_task_edit' => 'backendTaskEdit'
    ),
);
