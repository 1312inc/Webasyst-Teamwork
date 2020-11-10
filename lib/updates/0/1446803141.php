<?php

$model = new waModel();
$model->exec("
    UPDATE `tasks_task`
    SET update_datetime = create_datetime
    WHERE update_datetime IS NULL
");

$model->exec("
    ALTER TABLE `tasks_task` CHANGE `update_datetime` `update_datetime` DATETIME NOT NULL
");
