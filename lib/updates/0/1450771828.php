<?php
$model = new waModel();
try {
    $model->query("ALTER TABLE `tasks_task` ADD FULLTEXT `name_text` (`name`, `text`)");
} catch (waDbException $e) {
}