<?php

return array(
    'name'            => 'Git',
    'description'     => 'Commits, tests, release handler',
    'img'             => 'img/git.png',
    'version'         => '0.2.10',
    'vendor'          => 'webasyst',
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
