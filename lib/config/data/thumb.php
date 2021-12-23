<?php

function exit_with_tasks_image_not_found()
{
    if (waSystemConfig::isDebug()) {
        try {
            if (class_exists('waException')) {
                throw new waException('Not found', 404);
            } else {
                header("HTTP/1.0 404 Not Found");
                throw new Exception('Not found');
            }
        } catch (Exception $ex) {
            print $ex;
        }
    } else {
        header(
            "Location: " . str_replace('/index.php', '/wa-apps/tasks/img/image-not-found.png', $_SERVER['SCRIPT_NAME'])
        );
    }
    exit;
}

// !!! ugly hack to make wa()->getRootUrl() work
$_SERVER['SCRIPT_NAME'] = str_replace('/wa-data/public/tasks/tasks/thumb.php', '/index.php', $_SERVER['SCRIPT_NAME']);

$path = realpath(__DIR__ . "/../../../../../");
$config_path = $path . "/wa-config/SystemConfig.class.php";
if (!file_exists($config_path)) {
    exit_with_tasks_image_not_found();
}

require_once($config_path);
$config = new SystemConfig();
waSystem::getInstance(null, $config);

$app_config = wa('tasks', 1)->getConfig();
$protected_path = wa()->getDataPath('tasks/', false, 'tasks');
$public_url = str_replace(wa()->getRootUrl(true),'',wa()->getDataUrl('tasks/', true, 'tasks', true));
wa()->getStorage()->close();

/** @var tasksConfig $app_config */
$request_file = $app_config->getRequestUrl(true, true);
$request_file = preg_replace("~^thumb.php(/tasks)?/?~", '', $request_file);
$request_file = 'tasks/' . trim(str_replace(trim($public_url, '/'), '', trim($request_file, '/')), '/');

$is_url_ok = preg_match('~^
    # Two levels of dirs based on task id
    tasks/\d\d/\d\d/

    # Task id dir
    \d+/

    # Attachment id
    (\d+)\.

    # Attachment hash
    [^\.]+\.

    # Thumbnail size
    [^\.]+\.

    # Extension
    [a-z0-9]{3,4}
$~ix', $request_file, $matches);
if (!$is_url_ok) {
    exit_with_tasks_image_not_found();
}

$attach_id = $matches[1];
$attachment_model = new tasksAttachmentModel();
$attach = $attachment_model->getById($attach_id);

$full_preview_url = tasksHelper::getAttachPreviewUrl($attach);
$request_file_data_url = wa()->getDataUrl($request_file, true, 'tasks', false);
if ($full_preview_url !== $request_file_data_url) {
    exit_with_tasks_image_not_found();
}

$original_path = tasksHelper::getAttachPath($attach);
$thumb_path = wa()->getDataPath($request_file, true, 'tasks');
$size = 600;

if (file_exists($original_path) && !file_exists($thumb_path)) {
    $thumbs_dir = dirname($thumb_path);
    if (!file_exists($thumbs_dir)) {
        waFiles::create($thumbs_dir);
    }

    try {
        $image = waImage::factory($original_path);
        $image->resize($size, $size);
        $image->save($thumb_path, 80);
        @clearstatcache();
    } catch (Exception $e) {
        if (class_exists('waLog')) {
            waLog::log($e->getMessage(), 'wa-apps/tasks/thumb.log');
        }
        exit_with_tasks_image_not_found();
    }
}

if (file_exists($thumb_path)) {
    waFiles::readFile($thumb_path);
} else {
    exit_with_tasks_image_not_found();
}

