<?php

$appPath = wa()->getAppPath(null, 'tasks');
$path = ['templates/push'];

foreach ($path as $item) {
    try {
        $filePath = sprintf('%s/%s', $appPath, $item);
        waFiles::delete($filePath, true);
    } catch (Exception $ex) {
        waLog::log('Error on deleting file ' . $filePath, 'tasks/update.log');
    }
}
