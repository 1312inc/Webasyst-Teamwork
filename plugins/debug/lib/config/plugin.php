<?php

return array(
    'name' => /*_wp*/('Debug'),
    'description' => /*_wp*/('Debug events helper'),
    'img' => 'img/debug.png',
    'vendor' => 'webasyst',
    'version' => '0.1',
    'custom_settings' => 0,
    'handlers' => array(
        'backend_assets' => 'backendAssets',
        'backend_sidebar' => 'backendSidebar',

        'tasks_log' => 'logEvent',

        'backend_tasks' => 'backendTasks',

        'backend_task_edit' => 'backendTaskEdit',
        'backend_task' => 'backendTask',
        'task_save' => 'logEvent',
        'task_delete' => 'logEvent',

        'tasks_collection' => 'logEvent',
        'tasks_collection_search' => 'logEvent',
        'task_log_add' => 'logEvent',
        'task_log' => 'logEvent',

        'backend_list_edit' => 'backendListEdit',
        'list_save' => 'logEvent',
        'list_delete' => 'logEvent',

        'backend_milestone_edit' => 'backendMilestoneEdit',
        'milestone_save' => 'logEvent',
        'milestone_delete' => 'logEvent',

        'backend_settings_sidebar' => 'backendSettingsSidebar',
    ),
);
