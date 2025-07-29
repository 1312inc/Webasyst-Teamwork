<?php

$model = new waModel();

try {
    $model->exec("
        CREATE TABLE IF NOT EXISTS `tasks_field` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `name` varchar(64) NOT NULL,
            `control` varchar(64) NOT NULL,
            `sort` int(11) NOT NULL DEFAULT '0',
            `data` text,
            PRIMARY KEY (`id`)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8
    ");
} catch (waDbException $wdb_ex) {
}

try {
    $model->exec("
        CREATE TABLE IF NOT EXISTS `tasks_field_data` (
            `task_id` int(11) NOT NULL,
            `field_id` int(11) NOT NULL,
            `value` text,
            PRIMARY KEY (`task_id`,`field_id`)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8
    ");
} catch (waDbException $wdb_ex) {
}

try {
    $model->exec("
        CREATE TABLE IF NOT EXISTS `tasks_type_fields` (
            `type_id` varchar(32) NOT NULL,
            `field_id` int(11) NOT NULL
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8
    ");
} catch (waDbException $wdb_ex) {
}
