<?php

$model = new waModel();

try {
    $model->exec("SELECT parent_scope_id FROM tasks_milestone");
} catch (waDbException $wdb_ex) {
    $model->exec("ALTER TABLE `tasks_milestone` ADD `parent_scope_id` int DEFAULT NULL AFTER `project_id`");
}

try {
    $model->exec("SELECT start_date FROM tasks_milestone");
} catch (waDbException $wdb_ex) {
    $model->exec("ALTER TABLE `tasks_milestone` ADD `start_date` date DEFAULT NULL AFTER `due_date`");
}

try {
    $model->exec("SELECT end_date FROM tasks_milestone");
} catch (waDbException $wdb_ex) {
    $model->exec("ALTER TABLE `tasks_milestone` ADD `end_date` date DEFAULT NULL AFTER `start_date`");
}
