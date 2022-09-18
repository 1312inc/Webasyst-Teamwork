<?php
$m = new waModel();

try {
    $m->exec('alter table tasks_status_params modify name varchar(248) not null');
    $m->exec('alter table tasks_project_status_params modify name varchar(248) not null');
} catch (waException $exception) {
    waLog::log($exception->getMessage(), 'tasks/update.log');
    waLog::log($exception->getFullTraceAsString(), 'tasks/update.log');
}
