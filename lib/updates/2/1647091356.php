<?php

$path = wa()->getAppPath('widgets/actors/lib/classes/', 'tasks');

waFiles::delete($path, true);
waFiles::delete($path . '/templates/FilterControl.html', true);
waFiles::delete($path . '/config/settings.php', true);
