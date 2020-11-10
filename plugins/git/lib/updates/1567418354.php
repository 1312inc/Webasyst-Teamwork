<?php

$plugin_id = array('tasks', 'git');
$asm = new waAppSettingsModel();
$telegram_ci_fail_chat_id = $asm->get($plugin_id, 'telegram_chat_id');

if (empty($telegram_ci_fail_chat_id)) {
    return false;
}

$asm->del($plugin_id, 'telegram_chat_id');
$asm->set($plugin_id, 'telegram_ci_fail_chat_id', $telegram_ci_fail_chat_id);