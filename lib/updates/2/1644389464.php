<?php

$appPath = wa()->getAppPath(null, 'tasks');

waLog::dump(scandir($appPath . '/lib/classes'), 'tasks/update.log');
waLog::dump(scandir($appPath . '/lib/classes/Rights'), 'tasks/update.log');
waLog::dump(scandir($appPath . '/lib/classes/RIghts'), 'tasks/update.log');

$basePath = sprintf('%s/lib/classes', $appPath);
$pathBad = sprintf('%s/RIghts', $basePath);
$pathGood = sprintf('%s/Rights', $basePath);

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

        waFiles::move(sprintf('%s/%s', $path, $filePath), sprintf('%s/%s', $pathTmp, $filePath));
    }

    // и удалим папку
    waFiles::delete($path, true);
}

waLog::dump(scandir($pathTmp), 'tasks/update.log');

// и переименуем временную папку, где, надеюсь, собрались все файлы
waFiles::move($pathTmp, $pathGood);

waLog::dump(scandir($appPath . '/lib/classes'), 'tasks/update.log');
