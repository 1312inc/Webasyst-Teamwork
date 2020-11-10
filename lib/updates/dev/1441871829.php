<?php

$model = new waModel();

try {
    $model->exec('SELECT label_id FROM tasks_task WHERE 0');
} catch (waDbException $e) {
    $model->exec("ALTER TABLE `tasks_task` ADD `label_id` INT(11) NULL DEFAULT NULL AFTER `project_id`, ADD INDEX `label_id` (`label_id`)");
}


$model->exec("
    CREATE TABLE IF NOT EXISTS `tasks_label` (
     `id` int(11) NOT NULL AUTO_INCREMENT,
     `name` varchar(255) NOT NULL,
     `color` varchar(6) NOT NULL,
     PRIMARY KEY (`id`)
    ) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8
");