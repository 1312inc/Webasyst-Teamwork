<?php

$m = new waModel();
$m->exec("DELETE 
  FROM `tasks_releases_task_ext` 
  WHERE 
    `type` IS NULL AND
    `gravity` IS NULL AND
    `timecosts_plan` IS NULL AND
    `timecosts_fact` IS NULL AND
    `affected_version` IS NULL AND
    `resolution` IS NULL
  ");
