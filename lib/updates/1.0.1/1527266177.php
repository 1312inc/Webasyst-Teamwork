<?php

$m = new waModel();
try {
$m->exec("CREATE INDEX `milestone_id` ON `tasks_task` (`milestone_id`)");
} catch (waException $e) {
}
try {
$m->exec("CREATE INDEX `status_id` ON `tasks_task` (`status_id`)");
} catch (waException $e) {
}
try {
$m->exec("CREATE INDEX `assigned_contact_id` ON `tasks_task` (`assigned_contact_id`)");
} catch (waException $e) {
}