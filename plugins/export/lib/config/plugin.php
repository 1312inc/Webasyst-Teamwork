<?php

return array(
    'name'            => 'Export',
    'description'     => 'Exports task list to a CSV (Excel) file',
    'img'             => 'img/export.png',
    'version'         => '1.0.1',
    'vendor'          => '1021997',
    'custom_settings' => 0,
    'handlers'        => array(
        'backend_tasks' => 'backendTasks',
        'backend_assets' => 'backendAssets'
    ),
);
