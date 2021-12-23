<?php

$appPath = wa()->getAppPath(null, 'tasks');
waFiles::move($appPath.'/lib/classes/RIghts',$appPath.'/lib/classes/Rights');
