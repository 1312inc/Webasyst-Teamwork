<?php
$model = new waModel();
try {
    $model->query("ALTER TABLE `tasks_status`
        ADD `icon` varchar(255) NOT NULL DEFAULT '';
    ");
} catch (waDbException $e) {
}
