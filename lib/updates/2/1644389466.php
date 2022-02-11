<?php

$appPath = wa()->getAppPath(null, 'tasks');

$basePath = sprintf('%s/lib/classes', $appPath);
$pathBad = sprintf('%s/RIghts', $basePath);
$pathGood = sprintf('%s/Rights', $basePath);
$standaloneFile = sprintf('%s/%s', $basePath, 'tasksRights.class.php');

waLog::dump(scandir($basePath), 'tasks/update.log');

if (file_exists($standaloneFile)) {
    waFiles::delete($standaloneFile);
    waLog::log(sprintf('Deleted %s', $standaloneFile), 'tasks/update.log');
}

if (!file_exists($pathBad)) {
    waLog::log(sprintf('Path %s not exists', $pathBad), 'tasks/update.log');

    return;
}

waLog::dump(scandir($pathGood), 'tasks/update.log');
waLog::dump(scandir($pathBad), 'tasks/update.log');

$paths = [$pathBad, $pathGood];
$pathTmp = sprintf('%s/_Rights', $basePath);
waFiles::create($pathTmp, true);

// соберем все во временную папку
foreach ($paths as $path) {
    if (!file_exists($path)) {
        continue;
    }

    foreach (scandir($path) as $filePath) {
        if (in_array($filePath, ['.', '..'], true)) {
            continue;
        }

        $file = sprintf('%s/%s', $path, $filePath);
        copy($file, sprintf('%s/%s', $pathTmp, $filePath));
        @unlink($file);
    }

    // и удалим папку
    if (@rmdir($path)) {
        waLog::log(sprintf('Path %s deleted', $path), 'tasks/update.log');
    } else {
        waLog::log(sprintf('Path %s still exists', $path), 'tasks/update.log');
    }
}

waLog::log($pathTmp, 'tasks/update.log');
waLog::dump(scandir($pathTmp), 'tasks/update.log');

// и переименуем временную папку, где, надеюсь, собрались все файлы
if (waFiles::move($pathTmp, $pathGood)) {
    waFiles::delete($pathTmp);
    waLog::log(sprintf('Path %s moved to %s', $pathTmp, $pathGood), 'tasks/update.log');
    waLog::dump(scandir($pathGood), 'tasks/update.log');
}

waLog::log($basePath, 'tasks/update.log');
waLog::dump($basePath, 'tasks/update.log');
