<?php

$_installer = new tasksInstaller();
$_installer->createTable('tasks_list');

try {
    $model = new waModel();
    $model->exec("ALTER TABLE `tasks_task_log_params` ADD INDEX( `name`)");
} catch (waDbException $e) {
}

