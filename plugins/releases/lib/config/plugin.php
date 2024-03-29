<?php

return array(
    'name'            => 'Releases',
    'description'     => 'Releases',
    'img'             => 'img/releases.svg',
    'version'         => '0.3.3',
    'vendor'          => '1021997',
    'custom_settings' => true,
    'handlers'        => array(
        'backend_assets'           => 'backendAssets',
        'backend_tasks'            => 'backendTasks',
        'backend_task'             => 'backendTask',
        'backend_task_edit'        => 'backendTaskEdit',
        'backend_task_info'        => 'backendTaskInfo',
        'task_save'                => 'taskSave',
        'project_delete'           => 'projectDelete',
        'backend_list_edit'        => 'backendListEdit',
        'milestone_save'           => 'milestoneSave',
        'milestone_delete'         => 'milestoneDelete',
        'tasks_collection_search'  => 'tasksCollectionSearch',
        'backend_milestone_edit'   => 'backendMilestoneEdit',
        'backend_settings_sidebar' => 'backendSettingsSidebar',
        'backend_sidebar'          => 'backendSidebar',
        'show_status_form'         => 'showStatusForm',
        'save_status_form'         => 'saveStatusForm',
        'kanban_status_tasks'      => 'kanbanStatusTasks',
        'kanban_page'              => 'kanbanPage',
    ),
);
