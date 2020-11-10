<?php

$model = new waModel();
try {
    $model->exec('SELECT favorite FROM tasks_tag WHERE 0');
} catch (waDbException $e) {
    $model->exec('ALTER TABLE `tasks_tag` ADD `favorite` TINYINT(4) NOT NULL DEFAULT 0');
}