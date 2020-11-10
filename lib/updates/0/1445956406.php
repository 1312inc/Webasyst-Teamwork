<?php

$model = new waModel();
$model->exec('CREATE TABLE IF NOT EXISTS `tasks_favorite` (
 `contact_id` int(11) NOT NULL,
 `task_id` int(11) NOT NULL,
 PRIMARY KEY (`contact_id`,`task_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8');


try {
    $model->exec('ALTER TABLE tasks_favorite ADD PRIMARY KEY (contact_id, task_id)');
} catch (waDbException $e) {
}
