<?php

$appPath = wa()->getAppPath(null, 'tasks');
waFiles::move($appPath . '/lib/classes/Rights/tasksRights.class.php', $appPath . '/lib/classes/tasksRights.class.php');
