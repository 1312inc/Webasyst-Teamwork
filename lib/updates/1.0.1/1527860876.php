<?php

$m = new waModel();

try{
    $m->exec('SELECT comment_log_id FROM tasks_task');
} catch (Exception $e) {
    $m->exec('ALTER TABLE tasks_task ADD comment_log_id int NULL');
}

