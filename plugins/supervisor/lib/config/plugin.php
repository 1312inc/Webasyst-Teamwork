<?php

return array (
    'name' => 'Supervisor',
    'img' => 'img/supervisor.svg',
    'version' => '1.0',
    'vendor' => 'webasyst',
    'handlers' => array(
        'backend_sidebar' => 'backendSidebar',
        'tasks_collection' => 'tasksCollection',
        'backend_task_edit' => 'backendTaskEdit',
        'task_save' => 'taskSave',
        'task_delete' => 'taskDelete',
        'task_log_add' => 'taskLogAdd'
    )
);
