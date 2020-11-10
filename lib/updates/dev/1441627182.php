<?php
$model = new waModel();
try {
    $model->query("ALTER TABLE `tasks_project`
        ADD `icon` varchar(255) NOT NULL DEFAULT '',
        ADD `color` varchar(50) NOT NULL DEFAULT '';
    ");
} catch (waDbException $e) {
}
