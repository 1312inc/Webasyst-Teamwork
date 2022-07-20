<?php

$m = new waModel();

try {
    $m->exec('SELECT public_hash FROM tasks_task LIMIT 1');
} catch (waException $exception) {
    $m->exec('ALTER TABLE tasks_task ADD public_hash VARCHAR(36) DEFAULT NULL NULL');
    $m->exec('CREATE UNIQUE INDEX tasks_task_public_hash_uindex ON tasks_task (public_hash)');
}
