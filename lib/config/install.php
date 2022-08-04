<?php

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

try {
    $project_model = new tasksProjectModel();
    $status_model = new tasksStatusModel();

    if (!$project_model->countAll() && !$status_model->countAll()) {

        $statusDoingId = $status_model->insert(array(
            'name' => _w('Doing'),
            'button' => _w('Start doing'),
            'sort' => 2,
            'icon' => 'status-yellow-tiny'
        ));
        if ($statusDoingId) {
            $params_model = new tasksStatusParamsModel();
            $params_model->set($statusDoingId, array(
                'assign_user' => '',
                'assign' => '',
                'button_color' => 'ffdc2f',
                'title_color' => '000',
                'allow_comment' => 0
            ));
        }

        $statusTestingId = $status_model->insert(array(
            'name' => _w('Testing'),
            'button' => _w('To test'),
            'sort' => 3,
            'icon' => 'status-red-tiny'
        ));
        if ($statusTestingId) {
            $params_model = new tasksStatusParamsModel();
            $params_model->set($statusTestingId, array(
                'assign_user' => '',
                'assign' => 'select',
                'button_color' => 'ff7416',
                'title_color' => 'ffffff',
                'allow_comment' => 1
            ));
        }

        $project_id = $project_model->add(array(
            'name' => wa()->accountName(),
            'icon' => 'blog'
        ));
        if ($project_id) {
            $project_status_model = new tasksProjectStatusesModel();
            $project_status_model->insert(array(
                'project_id' => $project_id,
                'status_id' => $statusDoingId,
            ));
            $project_status_model->insert(array(
                'project_id' => $project_id,
                'status_id' => $statusTestingId,
            ));
        }
    }
} catch (Exception $e) {
    waLog::log($e->getMessage(), 'tasks/install.log');
}

$utf8mb4 = new tasksUtf8mb4Converter();
$m = new waModel();
foreach ($utf8mb4->getTables() as $table => $columns) {
    foreach ($columns as $column) {
        try {
            $utf8mb4->convertColumn($table, $column);
        } catch (Exception $e) {
            waLog::log($e->getMessage(), 'tasks/install.log');
        }
    }
}
try {
    $m->query('ALTER TABLE `tasks_task` ADD FULLTEXT `name_text` (`name`, `text`)');
} catch (Exception $e) {
    waLog::log($e->getMessage(), 'tasks/install.log');
}
