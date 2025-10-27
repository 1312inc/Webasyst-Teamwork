<?php

$model = new waModel();

try {
    $model->exec("SELECT public_hash FROM tasks_milestone");
} catch (waDbException $wdb_ex) {
    $model->exec("ALTER TABLE `tasks_milestone` ADD `public_hash` VARCHAR(36) DEFAULT NULL NULL");
    $model->exec("CREATE UNIQUE INDEX tasks_milestone_public_hash_uindex ON tasks_milestone (public_hash)");
}

try {
    $model->exec("SELECT public_hash FROM tasks_project");
} catch (waDbException $wdb_ex) {
    $model->exec("ALTER TABLE `tasks_project` ADD `public_hash` VARCHAR(36) DEFAULT NULL NULL");
    $model->exec("CREATE UNIQUE INDEX tasks_project_public_hash_uindex ON tasks_project (public_hash)");
}
