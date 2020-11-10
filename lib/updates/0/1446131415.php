<?php

$model = new waModel();
try {
    $model->query('SELECT `sort` FROM `tasks_project` WHERE 0');
} catch (waDbException $e) {
    $model->exec("ALTER TABLE `tasks_project` ADD `sort` INT NOT NULL DEFAULT '0'");
}