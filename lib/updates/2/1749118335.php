<?php

$path = wa()->getAppPath('lib/classes/', 'tasks');

waFiles::delete($path . 'Api/Team/GetList/tasksApiTeamGetListHandler.class.php');
waFiles::delete($path . 'Services/Dto/tasksTeammateStatusDto.class.php');
waFiles::delete($path . 'Services/tasksTeammateStatusService.class.php');
waFiles::delete($path . 'RIghts');
waFiles::delete($path . 'Rights');
