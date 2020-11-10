<?php

$model = new waModel();
try {
    $model->query("ALTER TABLE `tasks_task_log_params` CHANGE `log_Id` `log_id` INT(11) NOT NULL");
} catch (waException $e) {
}