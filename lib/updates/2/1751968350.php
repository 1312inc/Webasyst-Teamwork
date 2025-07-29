<?php

$model = new waModel();

try {
    $model->exec("
        UPDATE tasks_milestone tm JOIN (
            SELECT t.milestone_id, MIN(t.create_datetime) AS start_date FROM tasks_task t
            WHERE t.milestone_id IS NOT NULL
            GROUP BY t.milestone_id
        ) tt ON tm.id = tt.milestone_id
        SET tm.start_date = tt.start_date
    ");
} catch (waDbException $wdb_ex) {
}

try {
    $model->exec("
        UPDATE tasks_milestone tm JOIN (
            SELECT t.milestone_id, MAX(t.update_datetime) AS end_date FROM tasks_task t
            LEFT JOIN tasks_milestone t2 ON t2.id = t.milestone_id 
            WHERE t.milestone_id IS NOT NULL AND t2.closed = 1
            GROUP BY t.milestone_id
        ) tt ON tm.id = tt.milestone_id
        SET tm.end_date = tt.end_date
    ");
} catch (waDbException $wdb_ex) {
}
