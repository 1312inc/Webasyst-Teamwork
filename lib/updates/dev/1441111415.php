<?php

$model = new waModel();

$model->query("
    CREATE TABLE IF NOT EXISTS `tasks_task_tags` (
        `tag_id` int(11) NOT NULL,
        `task_id` int(11) NOT NULL,
        PRIMARY KEY (`task_id`,`tag_id`),
        KEY `tag_id` (`tag_id`)
    ) ENGINE=MyISAM DEFAULT CHARSET=utf8
");

$model->query("
    CREATE TABLE IF NOT EXISTS `tasks_tag` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `name` varchar(255) NOT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `name` (`name`)
    ) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8
");
