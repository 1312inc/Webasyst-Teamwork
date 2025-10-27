<?php

function initTasks()
{
    waLog::log(sprintf('%s. Demo was started at %s', microtime(true), date('Y-m-d H:i:s')), 'tasks/install.log');

    $appSettings = new waAppSettingsModel();
    $updateTime = $appSettings->get('tasks', 'update_time', 0);
    if ($updateTime) {
        waLog::log(sprintf('%s. Install was finished at %s', microtime(true), date('Y-m-d H:i:s', $updateTime)),
            'tasks/install.log');

        return;
    }

    // Setup auto thumbnail generation for task image attachments
    $path = wa()->getDataPath('tasks', true, 'tasks');
    $thumbsPath = $path . '/thumb.php';
    waFiles::write($thumbsPath, '<?php
$file = realpath(dirname(__FILE__)."/../../../../")."/wa-apps/tasks/lib/config/data/thumb.php";

if (file_exists($file)) {
    include($file);
} else {
    header("HTTP/1.0 404 Not Found");
}
');
    waFiles::copy(wa()->getAppPath('lib/config/data/.htaccess', 'tasks'), $path . '/.htaccess');

    $waModel = new waModel();
    try {
        $waModel->exec('LOCK TABLES
                            tasks_project WRITE,
                            tasks_status WRITE,
                            tasks_status_params WRITE,
                            tasks_project_statuses WRITE,
                            tasks_task WRITE,
                            tasks_tag WRITE,
                            tasks_task_tags WRITE,
                            tasks_user_role WRITE,
                            wa_app_settings WRITE');
        waLog::log('Lock tables ok', 'tasks/install.log');
    } catch (waDbException $e) {
        waLog::log('Lock tables error', 'tasks/install.log');
        waLog::log($e->getMessage()."\n".$e->getTraceAsString(), 'tasks/install.log');
    }

    try {
        $project_model = new tasksProjectModel();
        $status_model = new tasksStatusModel();
        $user_role_model = new tasksTasksUserRoleModel();

        if (!$project_model->countAll() && !$status_model->countAll()) {
            $statusDoingId = $status_model->insert([
                'name' => _w('Doing'),
                'button' => _w('Start doing'),
                'sort' => 2,
                'icon' => 'status-yellow-tiny',
            ]);
            if ($statusDoingId) {
                $params_model = new tasksStatusParamsModel();
                $params_model->set($statusDoingId, [
                    'assign_user' => '',
                    'assign' => '',
                    'button_color' => 'ffdc2f',
                    'title_color' => '000',
                    'allow_comment' => 0,
                ]);
            }

            $statusTestingId = $status_model->insert([
                'name' => _w('Testing'),
                'button' => _w('To test'),
                'sort' => 3,
                'icon' => 'status-red-tiny',
            ]);
            if ($statusTestingId) {
                $params_model = new tasksStatusParamsModel();
                $params_model->set($statusTestingId, [
                    'assign_user' => '',
                    'assign' => 'select',
                    'button_color' => 'ff7416',
                    'title_color' => 'ffffff',
                    'allow_comment' => 1,
                ]);
            }

            $project_id = $project_model->add([
                'name' => wa()->accountName(),
                'icon' => 'blog',
            ]);
            if ($project_id) {
                $project_status_model = new tasksProjectStatusesModel();
                $project_status_model->insert([
                    'project_id' => $project_id,
                    'status_id' => $statusDoingId,
                ]);
                $project_status_model->insert([
                    'project_id' => $project_id,
                    'status_id' => $statusTestingId,
                ]);

                $task_model = new tasksTaskModel();
                $task = $task_model->add([
                    'uuid' => tasksUuid4::generate(),
                    'project_id' => $project_id,
                    'name' => _w('Hello, World!'),
                    'text' => _w('This is a demo task. Go ahead and click “Doing” or just close it. #webasyst #demo'),
                    'assigned_contact_id' => wa()->getUser()->getId(),
                ]);

                if ($task) {
                    $tags = tasksTask::extractTags($task['text']);
                    (new tasksTaskTagsModel())->save($task['id'], $tags);
                }
            }
        }

        $data = array_map(function ($_dr) {
            return array_combine(['id', 'name', 'color', 'sort', 'show_inbox', 'send_notifications'], $_dr);
        }, [
            ['client', _w('Client'), '777777', 0, 1, 1],
            ['assistant', _w('Assistant'), '777777', 1, 1, 1],
            ['decision_maker', _w('Decision maker'), '777777', 2, 1, 1],
            ['supervisor', _w('Supervisor'), '777777', 3, 1, 1]
        ]);
        $user_role_model->multipleInsert($data);

    } catch (Exception $e) {
        waLog::log($e->getMessage()."\n".$e->getTraceAsString(), 'tasks/install.log');
    }

    try {
        $waModel->exec('UNLOCK TABLES');
        waLog::log('Unlock tables ok', 'tasks/install.log');
    } catch (waDbException $e) {
        waLog::log('Unlock tables error', 'tasks/install.log');
        waLog::log($e->getMessage()."\n".$e->getTraceAsString(), 'tasks/install.log');
    }

    waLog::log(sprintf('%s. Demo was finished at %s', microtime(true), date('Y-m-d H:i:s')), 'tasks/install.log');

    $utf8mb4 = new tasksUtf8mb4Converter();
    foreach ($utf8mb4->getTables() as $table => $columns) {
        foreach ($columns as $column) {
            try {
                $utf8mb4->convertColumn($table, $column);
            } catch (Exception $e) {
                waLog::log($e->getMessage()."\n".$e->getTraceAsString(), 'tasks/install.log');
            }
        }
    }

    waLog::log(sprintf('%s. Utf8mb4 was finished at %s', microtime(true), date('Y-m-d H:i:s')), 'tasks/install.log');
}

function semaphoreWay()
{
    $semaphore = sem_get(crc32('install_tasks'));
    if ($semaphore) {
        sem_acquire($semaphore);
        initTasks();
        sem_release($semaphore);
    } else {
        waLog::log(sprintf('%s. Semaphore is acquired already', microtime(true)), 'tasks/install.log');
    }
}

function lockfileWay()
{
    $path = wa()->getCachePath('installfile.lock', 'tasks');
    touch($path);
    $lockFile = fopen($path, 'r+');
    if (!$lockFile) {
        waLog::log(sprintf('%s. Lock file is failed', microtime(true)), 'tasks/install.log');

        initTasks();
    } elseif (flock($lockFile, LOCK_EX)) {
        try {
            initTasks();
        } catch (Exception $exception) {
            waLog::log(sprintf("%s\n%s", $exception->getMessage(), $exception->getTraceAsString()),
                'tasks/install.log');
        } finally {
            fflush($lockFile);
            flock($lockFile, LOCK_UN);
            fclose($lockFile);
        }
    } else {
        waLog::log(sprintf('%s. Lock file is locked', microtime(true)), 'tasks/install.log');
    }
    @unlink($path);
}

if (function_exists('sem_get')) {
    semaphoreWay();
} else {
    lockfileWay();
}
