<?php

$model = new waModel();

try {
    $model->exec("SELECT * FROM tasks_milestone_ext");
} catch (waDbException $wdb_ex) {
    $model->exec("
        CREATE TABLE `tasks_milestone_ext` (
            `status_id` int NOT NULL,
            `milestone_id` int NOT NULL,
            `limit` int DEFAULT NULL,
            PRIMARY KEY (`status_id`, `milestone_id`)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8
    ");
}

try {
    $model->exec("SELECT * FROM tasks_milestone_projects");
} catch (waDbException $wdb_ex) {
    $model->exec("
        CREATE TABLE `tasks_milestone_projects` (
            `milestone_id` int NOT NULL,
            `project_id` int NOT NULL,
            PRIMARY KEY (`milestone_id`,`project_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8
    ");
}

try {
    $model->exec("SELECT * FROM tasks_task_ext");
} catch (waDbException $wdb_ex) {
    $model->exec("
        CREATE TABLE `tasks_task_ext` (
            `task_id` int NOT NULL,
            `type` varchar(32) DEFAULT NULL,
            `gravity` varchar(32) DEFAULT NULL,
            `timecosts_plan` int DEFAULT NULL,
            `timecosts_fact` int DEFAULT NULL,
            `affected_version` varchar(32) DEFAULT NULL,
            `resolution` varchar(32) DEFAULT NULL,
            `kanban_color` varchar(50) DEFAULT NULL,
            PRIMARY KEY (`task_id`),
            KEY `type` (`type`),
            KEY `gravity` (`gravity`),
            KEY `resolution` (`resolution`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8
    ");
}

try {
    $model->exec("SELECT * FROM tasks_task_types");
} catch (waDbException $wdb_ex) {
    $model->exec("
        CREATE TABLE `tasks_task_types` (
            `id` varchar(32) NOT NULL,
            `name` varchar(32) NOT NULL,
            `color` varchar(64) DEFAULT NULL,
            `sort` int NOT NULL DEFAULT '0',
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8
    ");
}
