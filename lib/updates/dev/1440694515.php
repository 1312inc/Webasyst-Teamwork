<?php

$model = new waModel();

try {
    $model->query('SELECT after_state_id FROM tasks_task_log WHERE 0');
    $model->exec('ALTER TABLE `tasks_task_log` CHANGE `after_state_id` `after_status_id` INT(11) NOT NULL');
} catch (waDbException $e) {

}

try {
    $model->query('SELECT create_dateime FROM tasks_task_log WHERE 0');
    $model->exec("ALTER TABLE `tasks_task_log` CHANGE `create_dateime` `create_datetime` DATETIME NOT NULL");
} catch (waDbException $e) {

}