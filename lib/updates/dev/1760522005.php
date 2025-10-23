<?php

$model = new waModel();

try {
    $model->exec("ALTER TABLE tasks_task_users DROP INDEX contact_role");
} catch (waDbException $wdb_ex) {
}

try {
    $model->exec("ALTER TABLE tasks_user_role DROP COLUMN can_edit");
    $model->exec("ALTER TABLE tasks_user_role DROP COLUMN can_action");
    $model->exec("ALTER TABLE tasks_user_role DROP COLUMN can_comment");
    $model->exec("ALTER TABLE tasks_user_role DROP COLUMN can_delete");
} catch (waDbException $wdb_ex) {
}
