<?php

$model = new waModel();

try {
    $model->query('SELECT assigned_contact_Id FROM tasks_task_log WHERE 0');
    $model->exec("ALTER TABLE `tasks_task_log` CHANGE `assigned_contact_Id` `assigned_contact_id` INT(11) NULL DEFAULT NULL");
} catch (waDbException $e) {
}

try {
    $model->query('SELECT create_datetime FROM tasks_task_log WHERE 0');
    $model->query('ALTER TABLE `tasks_task_log` CHANGE `create_datetime` `create_datetime` DATETIME NOT NULL');
} catch (waDbException $e) {

}