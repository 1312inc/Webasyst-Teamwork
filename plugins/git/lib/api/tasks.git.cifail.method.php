<?php

/*
 {
    "GITLAB_USER_NAME": "",
    "GITLAB_USER_EMAIL": "",
    "CI_COMMIT_REF_NAME": "dev",
    "CI_COMMIT_SHA": "2f747f4ec56c5d729258f11249964f4c9cfbbfd0",
    "CI_COMMIT_SHORT_SHA": "2f747f4e",
    "CI_PROJECT_DIR": "/builds/webasyst/framework",
    "CI_PROJECT_NAME": "framework",
    "CI_PROJECT_PATH_SLUG": "webasyst-framework",
    "CI_PROJECT_URL": "https://git.webasyst.com/webasyst/framework"
    "CI_JOB_ID": "2202"
    "CI_JOB_URL": https://git.webasyst.com/webasyst/framework/-/jobs/2202

}
 */

class tasksGitCifailMethod extends waAPIMethod
{
    protected $method = 'POST';

    protected $data;

    protected $telegram_api_token;
    protected $telegram_ci_fail_chat_id;

    protected $http_proxy_options = array();


    public function prepareData()
    {
        $this->data = waRequest::post();

        $plugin_id = array('tasks', 'git');

        $this->telegram_api_token = wa()->getSetting('telegram_bot_token', null, $plugin_id);
        $this->telegram_ci_fail_chat_id = wa()->getSetting('telegram_ci_fail_chat_id', null, $plugin_id);

        $http_proxy_host = wa()->getSetting('http_proxy_host', null, $plugin_id);
        $http_proxy_port = wa()->getSetting('http_proxy_port', null, $plugin_id);

        if (!empty($http_proxy_host)) {
            $this->http_proxy_options['proxy_host'] = $http_proxy_host;
            $this->http_proxy_options['proxy_port'] = $http_proxy_port;
        }
    }

    public function execute()
    {
        $this->prepareData();

        if (empty($this->data)) {
            return;
        }

        $contact_email = $this->data['GITLAB_USER_EMAIL'];
        $contact = $this->findContactByEmail($contact_email);
        $telegram_login = !empty($contact['telegram']) ? $contact['telegram'] : $this->getTelegramLoginByEmail($contact_email);
        if (!empty($telegram_login)) {
            $telegram_login = $this->clearLogin($telegram_login);
        }

        $view = wa('tasks')->getView();
        $view->assign($this->data);
        $view->assign('telegram_login', $telegram_login);

        $template_path = wa('tasks')->getAppPath('plugins/git/templates/messages/telegram-ci-fail.html');
        $text = $view->fetch($template_path);

        $params = array(
            'chat_id' => $this->telegram_ci_fail_chat_id,
            'text'    => $text,
        );

        $telegram = new tasksGitPluginTelegram($this->telegram_api_token, array('proxy_options' => $this->http_proxy_options));
        $res = $telegram->sendMessage($params);
        $this->response = array('data' => $this->data, 'response' => $res);
    }

    protected function findContactByEmail($email)
    {
        $m = new waModel();

        $sql = "SELECT c.id, e.email, d.value as telegram
		FROM wa_contact AS c

		JOIN wa_contact_emails AS e
			ON e.contact_id = c.id
				AND e.email =  '".$m->escape($email)."'

		JOIN wa_contact_data as d
			ON d.contact_id = c.id
				AND (d.field = 'im' OR d.field = 'socialnetwork')
				AND d.ext IN ('T', 'Telegram', 'Телеграм', 'Телега')";

        $contacts = $m->query($sql)->fetchAll('email');

        return ifempty($contacts, $email, null);
    }

    private function getTelegramLoginByEmail($email)
    {
        $users = array(
        );

        return ifempty($users, $email, null);
    }

    private function clearLogin($login)
    {
        $login = preg_replace('~^(https?\:\/\/)?(t.me\/|telegram\.me|tlg\.name)?(\@)?~ui', '', $login);
        return $login;
    }
}