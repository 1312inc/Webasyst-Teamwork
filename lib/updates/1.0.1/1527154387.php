<?php

$m = new waModel();

try {
    $m->query('SELECT `due_date` FROM `tasks_task` WHERE 0');
} catch (waDbException $e) {
    $m->exec('ALTER TABLE `tasks_task` ADD COLUMN `due_date` DATE NULL DEFAULT NULL');
}
