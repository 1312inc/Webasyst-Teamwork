<?php

$_installer = new tasksInstaller();
$_installer->createTable('tasks_task_repeat');
$m = new waModel();

try {
    $m->exec('SELECT `repeat_task_id` FROM `tasks_task` LIMIT 0');
} catch (waDbException $e) {
    $m->exec("
        ALTER TABLE `tasks_task` 
            ADD `repeat_task_id` INT NULL DEFAULT NULL AFTER `due_date`, 
            ADD `repeat_occurrence` INT NOT NULL DEFAULT '0' AFTER `repeat_task_id`,
            ADD INDEX `repeat_task` (`repeat_task_id`, `repeat_occurrence`)
    ");
}
