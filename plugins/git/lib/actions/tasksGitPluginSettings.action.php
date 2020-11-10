<?php

class tasksGitPluginSettingsAction extends waViewAction
{
    public function execute()
    {
        $token_model = new waApiTokensModel();
        $token = $token_model->getToken(0, 'tasks/git', 'tasks');

        $root_url = wa()->getRootUrl(true, false);

        $commit_url = $root_url.'api.php/tasks/git?access_token='.$token;
        $ci_fail_url = $root_url.'api.php/tasks/git.cifail?access_token='.$token;

        $plugin_id = array('tasks', 'git');

        $telegram_bot_token = wa()->getSetting('telegram_bot_token', '', $plugin_id);
        $telegram_ci_fail_chat_id = wa()->getSetting('telegram_ci_fail_chat_id', '', $plugin_id);
        $telegram_release_chat_id = wa()->getSetting('telegram_release_chat_id', '', $plugin_id);
        $telegram_archives_chat_id = wa()->getSetting('telegram_archives_chat_id', '', $plugin_id);

        $http_proxy_host = wa()->getSetting('http_proxy_host', '', $plugin_id);
        $http_proxy_port = wa()->getSetting('http_proxy_port', '', $plugin_id);

        $js = wa('tasks')->getAppPath('plugins/git/js/git.settings.js');

        $this->view->assign(array(
            'commit_url'                => $commit_url,
            'ci_fail_url'               => $ci_fail_url,
            'telegram_bot_token'        => $telegram_bot_token,
            'telegram_ci_fail_chat_id'  => $telegram_ci_fail_chat_id,
            'telegram_release_chat_id'  => $telegram_release_chat_id,
            'telegram_archives_chat_id' => $telegram_archives_chat_id,
            'http_proxy_host'           => $http_proxy_host,
            'http_proxy_port'           => $http_proxy_port,
            'js'                        => $js,
        ));
    }
}
