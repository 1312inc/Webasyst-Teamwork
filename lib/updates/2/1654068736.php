<?php

$path = wa()->getAppPath('lib/classes/', 'tasks');

waFiles::delete($path . 'Services/Invite/tasksInviteService.class.php');
waFiles::delete($path . 'Services/Invite/teamInviting.class.php');
waFiles::delete($path . 'Services/Invite/teamUserInviting.class.php');
waFiles::delete($path . 'Services/Invite/teamUserInvitingByEmail.class.php');
