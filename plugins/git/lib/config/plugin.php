<?php

return array(
    'name'            => 'Git',
    'description'     => 'Commits, tests, and releases handler',
    'img'             => 'img/git.png',
    'version'         => '1.0.0',
    'vendor'          => '1021997',
    'custom_settings' => 1,
    'handlers'        => array(
        'task_log'  => 'taskLog',
        'tasks_log' => 'tasksLog',
        '*'                    => array(
            array(
                'event_app_id' => 'baza',
                'event'        => 'product_approve',
                'class'        => 'tasksGitPlugin',
                'method'       => 'bazaProductRelease',
            ),
            array(
                'event_app_id' => 'updates',
                'event'        => 'product_update_status',
                'class'        => 'tasksGitPlugin',
                'method'       => 'updatesProductArchive',
            ),
        )
    ),
);
