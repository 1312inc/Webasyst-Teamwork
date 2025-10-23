<?php

$model = new waModel();

try {
    $model->exec("
        CREATE TABLE IF NOT EXISTS `tasks_user_role` (
            `id` varchar(255) NOT NULL,
            `name` varchar(255) NOT NULL,
            `color` varchar(64),
            `sort` INT NOT NULL DEFAULT '0',
            `show_inbox` TINYINT NOT NULL DEFAULT '0',
            `send_notifications` TINYINT NOT NULL DEFAULT '0',
            PRIMARY KEY (`id`)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 
    ");
} catch (waDbException $wdb_ex) {
}

try {
    $model->exec("
        CREATE TABLE IF NOT EXISTS `tasks_task_users` (
            `task_id` int(11) NOT NULL,
            `contact_id` int(11) NOT NULL,
            `role_id` varchar(255) NOT NULL,
            `create_datetime` datetime NOT NULL
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 
    ");
} catch (waDbException $wdb_ex) {
}
