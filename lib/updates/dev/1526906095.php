<?php

$m = new waModel();

try {
    $m->query('SELECT * FROM `tasks_list` WHERE 0');
} catch (waDbException $e) {

    // tasks_list doesn't exist

    try {
        $m->query('SELECT * FROM `tasks_view` WHERE 0');

        // tasks_view exists
        $m->exec('RENAME TABLE `tasks_view` TO `tasks_list`');

    } catch (waDbException $e) {

        // tasks_view doesn't exist
        $_installer = new tasksInstaller();
        $_installer->createTable('tasks_list');
    }
}

// prev update merge with this update

try {
    $m->query("SELECT `params` FROM `tasks_list` WHERE 0");
} catch (waDbException $e) {
    $m->exec("ALTER TABLE `tasks_list` ADD COLUMN `params` TEXT AFTER `hash`");
}
