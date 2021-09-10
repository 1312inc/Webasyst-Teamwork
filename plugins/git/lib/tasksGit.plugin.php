<?php

class tasksGitPlugin extends waPlugin
{
    protected $plugin_id = ['tasks', 'git'];

    public function tasksLog(&$logs_by_task)
    {
        foreach ($logs_by_task as $id => &$log) {
            $this->taskLog($log);
        }
        unset($log);
    }

    public function taskLog(&$log)
    {
        if (!$log) {
            return;
        }

        foreach ($log as &$l) {
            if (!empty($l['params']['git.id'])) {
                $home = $l['params']['git.homepage'];
                $url_id = sprintf('%s/commit/%s', $home, $l['params']['git.id']);
                $url_branch = sprintf('%s/commits/%s', $home, $l['params']['git.branch']);
                $id = substr($l['params']['git.id'], 0, 8);

                $l['text'] = rtrim($l['text']) . "\n" . <<<MARKDOWN
Pushed commit [{$id}]({$url_id}) to branch [{$l['params']['git.branch']}]({$url_branch})
MARKDOWN;
            }
        }
        unset($l);
    }

    protected function formatProductSlug(&$product)
    {
        $formatted_slug = null;

        if ($product['type'] == 'APP') {
            $formatted_slug = $product['app_id'];
        } elseif ($product['type'] == 'PLUGIN') {
            $app_id = str_replace('wa-plugins/', '', $product['app_id']);
            $formatted_slug = "{$app_id}/plugin/{$product['ext_id']}";
        } elseif ($product['type'] == 'THEME') {
            $formatted_slug = "{$product['app_id']}/theme/{$product['ext_id']}";
        } elseif ($product['type'] == 'WIDGET') {
            $formatted_slug = "{$product['app_id']}/widget/{$product['ext_id']}";
        }

        if (!empty($formatted_slug)) {
            $product['formatted_slug'] = $formatted_slug;
        }
    }

    public function bazaProductRelease($product)
    {
        if (empty($product)) {
            return;
        }

        if (!wa()->appExists('baza')) {
            return;
        }

        //waLog::dump(['release', $product], 'telegram/archive.log');

        wa('baza');
        $store_url = null;
        $is_framework = ($product['type'] == 'APP' && $product['app_id'] == 'installer');
        if ($is_framework) {
            $store_url = 'https://www.webasyst.ru/platform/updates/';
        } elseif (!empty($product['license']) && $product['license'] !== 'HIDDEN') {
            $store_url = bazaHelper::getStoreUrl($product, false, 'ru_RU') . 'changelog/';
        }

        $baza_url = null;
        if (!empty($product['id'])) {
            $baza_url = wa()->getRootUrl(true) . wa()->getConfig()->getBackendUrl(
                ) . "/baza/#/developer/product/{$product['id']}/";
        }

        $this->formatProductSlug($product);

        $black_list = [
            'site/theme/artsale',
            'blog/theme/artsale',
            'photos/theme/artsale',
            'photos/plugin/artsale',
        ];

        if (!empty($product['formatted_slug']) && in_array($product['formatted_slug'], $black_list)) {
            return;
        }

        $telegram_release_chat_ids = wa()->getSetting('telegram_release_chat_id', null, $this->plugin_id);
        $telegram_release_chat_ids = explode(';', $telegram_release_chat_ids);

        $template_path = wa('tasks')->getAppPath('plugins/git/templates/messages/telegram-release.html');

        $params = [
            'template_path' => $template_path,
            'product' => $product,
            'vars' => [
                'baza_url' => $baza_url,
                'store_url' => $store_url,
            ],
        ];
        foreach ($telegram_release_chat_ids as $release_chat_id) {
            if (empty($release_chat_id)) {
                continue;
            }
            $params['chat_id'] = $release_chat_id;
            $this->sendMessage($params);
        }
    }

    public function updatesProductArchive($product)
    {
        if (empty($product)) {
            return;
        }

        //waLog::dump(['archive', $product], 'telegram/archive.log');

        $this->formatProductSlug($product);

        $black_list = [
            'tasks/plugin/git',
            'site/theme/artsale',
            'blog/theme/artsale',
            'photos/theme/artsale',
            'photos/plugin/artsale',
        ];

        if (!empty($product['formatted_slug']) && in_array($product['formatted_slug'], $black_list)) {
            return;
        }

        $baza_changelog_url = null;
        if (!empty($product['id'])) {
            $baza_changelog_url = wa()->getRootUrl(true) . wa()->getConfig()->getBackendUrl(
                ) . "/baza/#/developer/product/{$product['id']}/changelog/";
        }

        $telegram_archives_chat_ids = wa()->getSetting('telegram_archives_chat_id', null, $this->plugin_id);
        $telegram_archives_chat_ids = explode(';', $telegram_archives_chat_ids);

        $template_path = wa('tasks')->getAppPath('plugins/git/templates/messages/telegram-archive.html');

        $params = [
            'template_path' => $template_path,
            'product' => $product,
            'vars' => [
                'baza_changelog_url' => $baza_changelog_url,
            ],
        ];

        foreach ($telegram_archives_chat_ids as $archive_chat_id) {
            if (empty($archive_chat_id)) {
                continue;
            }
            $params['chat_id'] = $archive_chat_id;
            $this->sendMessage($params);
        }
    }

    protected function sendMessage($params)
    {
        if (empty($params['product']) || !wa()->appExists('updates')) {
            return null;
        }

        wa('updates');
        $vendor = updatesHelper::getVendor($params['product']);
        // Report only about our products
        if ($vendor !== 'webasyst') {
            return null;
        }

        $telegram_api_token = wa()->getSetting('telegram_bot_token', null, $this->plugin_id);
        if (empty($telegram_api_token) || empty($params['chat_id'])) {
            return null;
        }

        $options = $this->getNetOptions();
        $telegram = new tasksGitPluginTelegram($telegram_api_token, $options);

        $view = wa('tasks')->getView();
        $view->assign([
            'product' => $params['product'],
        ]);
        if (!empty($params['vars']) && is_array($params['vars'])) {
            $view->assign($params['vars']);
        }
        $text = $view->fetch($params['template_path']);
        $message_params = [
            'chat_id' => $params['chat_id'],
            'text' => $text,
        ];

        return $telegram->sendMessage($message_params);
    }

    protected function getNetOptions()
    {
        $http_proxy_options = [
            'proxy_host' => wa()->getSetting('http_proxy_host', '', $this->plugin_id),
            'proxy_port' => wa()->getSetting('http_proxy_port', '', $this->plugin_id),
        ];

        return [
            'proxy_options' => $http_proxy_options,
            'timeout' => 8,
        ];
    }
}
