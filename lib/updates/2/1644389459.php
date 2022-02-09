<?php

$appPath = wa()->getAppPath(null, 'tasks');

$path = sprintf('%s/lib/classes/tasksRights.class.php', $appPath);
if (waFiles::delete($path)) {
    waLog::log(sprintf('delete old tasksRights.class.php from %s', $path), 'tasks/update.log');
}

if (waFiles::move($appPath . '/lib/classes/RIghts', $appPath . '/lib/classes/Rights')) {
    waLog::log('rename RIghts ok', 'tasks/update.log');
}

waLog::dump(scandir($appPath . '/lib/classes'), 'tasks/update.log');
waLog::dump(scandir($appPath . '/lib/classes/Rights'), 'tasks/update.log');
