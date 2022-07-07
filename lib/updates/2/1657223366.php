<?php
$m = new waModel();

try {
    $m->exec('create index tasks_task_log_contact_id_assigned_contact_id_index on tasks_task_log (contact_id, assigned_contact_id)');
} catch (waException $exception) {
}
