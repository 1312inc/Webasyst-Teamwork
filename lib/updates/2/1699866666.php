<?php
$m = new waModel();
try {
    $m->exec("SELECT unread FROM `tasks_favorite` LIMIT 0");
} catch (waDbException $exception) {
    $m->exec("ALTER TABLE `tasks_favorite`
                  ADD `unread` TINYINT NOT NULL DEFAULT '0' AFTER `task_id`,
                  ADD INDEX `contact_unread` (`contact_id`, `unread`)
    ");
}

foreach(wa('tasks')->getConfig()->getPersonalNotificationSettings('all') as $contact_id => $settings) {
    if (ifset($settings, 'notification', 'action', 'off') !== 'off') {
        if (!in_array('favorites', ifset($settings, 'notification', 'task', []))) {
            $settings['notification']['task'][] = 'favorites';
            wa('tasks')->getConfig()->setPersonalNotificationSettings($settings, $contact_id);
        }
    }
}
