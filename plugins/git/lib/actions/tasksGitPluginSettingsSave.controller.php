<?php

class tasksGitPluginSettingsSaveController extends waJsonController
{
    protected $plugin_id = "git";

    public function execute()
    {
        $telegram_bot_token = waRequest::post('telegram_bot_token', null, waRequest::TYPE_STRING_TRIM);
        $telegram_ci_fail_chat_id = waRequest::post('telegram_ci_fail_chat_id', null, waRequest::TYPE_STRING_TRIM);
        $telegram_release_chat_id = waRequest::post('telegram_release_chat_id', null, waRequest::TYPE_STRING_TRIM);
        $telegram_archives_chat_id = waRequest::post('telegram_archives_chat_id', null, waRequest::TYPE_STRING_TRIM);
        $http_proxy_host = waRequest::post('http_proxy_host', null, waRequest::TYPE_STRING_TRIM);
        $http_proxy_port = waRequest::post('http_proxy_port', null, waRequest::TYPE_STRING_TRIM);

        $this->getPlugin()->saveSettings(array(
            'telegram_bot_token'        => $telegram_bot_token,
            'telegram_ci_fail_chat_id'  => $telegram_ci_fail_chat_id,
            'telegram_release_chat_id'  => $telegram_release_chat_id,
            'telegram_archives_chat_id' => $telegram_archives_chat_id,
            'http_proxy_host'           => $http_proxy_host,
            'http_proxy_port'           => $http_proxy_port,
        ));

    }

    protected function getPlugin()
    {
        return waSystem::getInstance()->getPlugin($this->plugin_id);
    }
}