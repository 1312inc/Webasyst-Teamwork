<?php

return array (
    'name' => 'Supervisor',
    'img' => 'img/supervisor.png',
    'version' => '0.1',
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
