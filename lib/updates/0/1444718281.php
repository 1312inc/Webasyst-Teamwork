<?php

$model = new waModel();
$model->exec("
CREATE TABLE IF NOT EXISTS `tasks_milestone` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  `project_id` int(11) NOT NULL,
  `due_date` date DEFAULT NULL,
  `closed` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8
");

try {
    $model->exec("SELECT milestone_id FROM tasks_task WHERE 0");
} catch (waDbException $e) {
    $model->exec("
        ALTER TABLE `tasks_task` ADD `milestone_id` int(11) NULL DEFAULT NULL AFTER project_id
    ");
}
