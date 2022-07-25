<?php
$m = new waModel();

try {
    $m->exec('alter table tasks_task_log_params modify name varchar(249) not null');
} catch (waException $exception) {
    waLog::log($exception->getMessage(), 'tasks/update.log');
    waLog::log($exception->getFullTraceAsString(), 'tasks/update.log');
}
