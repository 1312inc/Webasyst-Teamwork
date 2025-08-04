<?php

$model = new waModel();

try {
    $model->exec("ALTER TABLE tasks_task ADD FULLTEXT name_text(`name`, `text`)");
} catch (waDbException $wdb_ex) {
}
