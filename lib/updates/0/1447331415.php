<?php

$model = new waModel();
try {
    $model->exec('DROP TABLE `tasks_label`');
} catch (waDbException $e) {
}

try {
    $model->exec('ALTER TABLE tasks_task DROP label_id');
} catch (waDbException $e) {
}