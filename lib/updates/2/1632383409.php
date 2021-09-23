<?php

$_installer = new tasksInstaller();
try {
    $_installer->createTable('tasks_push_client');
} catch (waDbException $e) {
}

