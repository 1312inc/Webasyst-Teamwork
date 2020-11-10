<?php

$model = new waModel();

try {
    $model->query('SELECT hidden_timestamp FROM tasks_task WHERE 0');
} catch (waDbException $e) {
    $model->exec("ALTER TABLE tasks_task ADD hidden_timestamp BIGINT(20) NOT NULL DEFAULT 0");
}