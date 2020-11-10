<?php

$model = new waModel();

try {
    $model->query('SELECT create_contact_id FROM tasks_task WHERE 0');
} catch (waDbException $e) {
    $model->exec('ALTER TABLE `tasks_task` CHANGE `contact_id` `create_contact_id` INT(11) NOT NULL');
    $model->exec('ALTER TABLE `tasks_task` ADD `contact_id` INT(11) NULL DEFAULT NULL');
}