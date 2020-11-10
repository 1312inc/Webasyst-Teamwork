<?php

$model = new waModel();

try {
    $model->query('SELECT action FROM tasks_task_log WHERE 0');
} catch (waDbException $e) {
    $model->exec("ALTER TABLE `tasks_task_log` ADD `action` VARCHAR(255) NULL DEFAULT NULL");
}