<?php

$model = new waModel();

try {
    $model->query('SELECT archive_datetime FROM tasks_project WHERE 0');
} catch (waDbException $e) {
    $model->exec('ALTER TABLE tasks_project ADD archive_datetime DATETIME NULL DEFAULT NULL');
}