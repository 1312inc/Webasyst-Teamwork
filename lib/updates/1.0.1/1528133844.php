<?php

$m = new waModel();
$m->exec("UPDATE `tasks_task` SET milestone_id = NULL WHERE milestone_id = 0");
