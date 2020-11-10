<?php

$model = new waModel();

$model->exec('UPDATE tasks_task SET assigned_contact_id = NULL WHERE assigned_contact_id = 0');

try {
    $model->exec('SELECT assign_log_id FROM tasks_task WHERE 0');
} catch (waDbException $e) {
    $model->exec('ALTER TABLE tasks_task ADD assign_log_id INT (11) NULL DEFAULT NULL');
}