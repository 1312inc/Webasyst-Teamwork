<?php

$model = new waModel();
try {
    $model->exec("SELECT `code` FROM tasks_attachment WHERE 0");
} catch (waDbException $e) {
    // Add column filled with NULLs
    $model->exec("ALTER TABLE `tasks_attachment` ADD `code` VARCHAR(16) NULL DEFAULT NULL");

    // Generate codes replacing NULLs
    $random_letter = "SUBSTRING('abcdefghijklmnopqrstuvwxyz0123456789', rand()*36+1, 1)";
    $random_code_sql = "CONCAT(".join(',', array_fill(0, 16, $random_letter)).")";
    $sql = "UPDATE tasks_attachment SET code={$random_code_sql} WHERE code IS NULL";
    $model->exec($sql);

    // Alter column and prohibit NULLs
    $model->exec("ALTER TABLE `tasks_attachment` CHANGE `code` `code` VARCHAR(16) NOT NULL");
}

// Setup auto thumbnail generation for task image attachments
$path = wa()->getDataPath('tasks', true, 'tasks');
waFiles::write($path.'/thumb.php', '<?php
$file = realpath(dirname(__FILE__)."/../../../../")."/wa-apps/tasks/lib/config/data/thumb.php";

if (file_exists($file)) {
    include($file);
} else {
    header("HTTP/1.0 404 Not Found");
}
');
waFiles::copy(wa()->getAppPath('lib/config/data/.htaccess', 'tasks'), $path.'/.htaccess');
