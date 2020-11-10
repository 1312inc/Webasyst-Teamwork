<?php

$model = new waModel();
try {
    $model->query('SELECT project_id FROM tasks_task_log WHERE 0');
} catch (waDbException $e) {
    $model->exec('ALTER TABLE tasks_task_log ADD project_id INT (11) NOT NULL AFTER id');
    $model->exec('UPDATE tasks_task_log l JOIN tasks_task t ON l.task_id = t.id SET l.project_id = t.project_id');
}