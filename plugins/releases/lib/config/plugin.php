<?php

return array(
    'name'            => 'Releases',
    'description'     => 'Releases',
    'img'             => 'img/releases.png',
    'version'         => '0.2',
    'vendor'          => 'webasyst',
    'custom_settings' => true,
    'handlers'        => array(
        'backend_assets'           => 'backendAssets',
        'backend_tasks'            => 'backendTasks',
        'backend_task'             => 'backendTask',
        'backend_task_edit'        => 'backendTaskEdit',
        'task_save'                => 'taskSave',
        'backend_list_edit'        => 'backendListEdit',
        'milestone_save'           => 'milestoneSave',
        'tasks_collection_search'  => 'tasksCollectionSearch',
        'backend_milestone_edit'   => 'backendMilestoneEdit',
        'backend_settings_sidebar' => 'backendSettingsSidebar',
        'show_status_form'         => 'showStatusForm',
        'save_status_form'         => 'saveStatusForm',
    ),
);
