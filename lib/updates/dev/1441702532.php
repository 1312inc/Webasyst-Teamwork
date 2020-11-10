<?php

$model = new waModel();
try {
    $model->query('SELECT before_status_id FROM tasks_task_log WHERE 0');
    $model->exec("ALTER TABLE `tasks_task_log` CHANGE `before_status_id` `before_status_id` INT(11) NULL DEFAULT NULL");
} catch (waDbException $e) {
}

try {
    $model->query('SELECT assigned_contact_id FROM tasks_task_log WHERE 0');
} catch (waDbException $e) {
    $model->exec("ALTER TABLE `tasks_task_log` ADD `assigned_contact_Id` INT(11) NULL DEFAULT NULL");
}