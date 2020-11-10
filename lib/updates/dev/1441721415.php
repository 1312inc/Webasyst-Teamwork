<?php

$model = new waModel();
try {
    $model->query('SELECT log_id FROM tasks_attachment WHERE 0');
} catch (waDbException $e) {
    $model->exec("ALTER TABLE `tasks_attachment` ADD `log_id` INT(11) NULL DEFAULT NULL AFTER task_id");
    $model->exec("DELETE FROM tasks_task_log_params WHERE name=?", array('attach_ids'));
}