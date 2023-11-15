<?php
/**
 * Gather information about all the links mentioned inside task markdown text,
 * e.g.: users, CRM deals, Shop orders etc.
 *
 * Data prepared by this class is then used by JS in task editor and on task info page
 * to prettify those links.
 */
class tasksLinksPrettifier
{
    protected $processed = false;
    protected $data;

    protected static $team;

    public function addFromMarkdown($task_markdown_code)
    {
        $users = tasksTask::getAllMentionedUsers($task_markdown_code);
        foreach($users as $user) {
            $this->addMention($user);
        }

        if (preg_match_all('~\\[[^\\]]+\\]\\([^\\)]+\\)~', $task_markdown_code, $matches)) {
            foreach($matches[0] as $link_markdown_code) {
                $this->addLink($link_markdown_code);
            }
        }

        return $this;
    }

    public function addLink($markdown_code)
    {
        if ($this->processed) {
            throw new waException('Unable to add more links after ->getData()');
        }

        $markdown_code = trim($markdown_code);
        $link = $this->parseMarkdownLink($markdown_code);
        if (!$link) {
            return false;
        }

        $this->data[$markdown_code] = $link;
        return true;
    }

    public function addMention($user)
    {
        if ($this->processed) {
            throw new waException('Unable to add more mentions after ->getData()');
        }

        $login = $user['login'];

        $this->data['@'.$login] = [
            'app_id' => 'tasks',
            'entity_type' => 'user',
            'entity_image' => waContact::getPhotoUrl($user['id'], $user['photo'], null, null, ($user['is_company'] ? 'company' : 'person')),
            'entity_title' => '@'.$login,
            'entity_url' => wa()->getAppUrl('team')."u/{$login}/",
            'user_login' => $login,
        ];

        return true;
    }

    public function getData()
    {
        $this->process();
        return $this->data;
    }

    protected function parseMarkdownLink($markdown_code)
    {
        $link = tasksLinksPrettifierParsedownHelper::parseLink($markdown_code);
        $url = ifset($link, 'element', 'attributes', 'href', null);
        $link_text = ifset($link, 'element', 'text', null);
        if (!$url) {
            return null;
        }


        // Does it look like URL to WA backend?
        $root_url = wa()->getConfig()->getRootUrl(false);
        $backend_url = wa()->getConfig()->getBackendUrl(false);

        $all_apps = wa()->getApps();

        $regex = '~'.
            preg_quote($root_url.$backend_url.'/', '~').
            '('.
                join('|', array_map('preg_quote', array_keys($all_apps))).
            ')/~u';
        if (!preg_match($regex, $url, $match)) {
            return null;
        }
        $app_id = $match[1];

        $app_icon = ifset($all_apps, $app_id, 'icon', 48, null);
        if ($app_icon) {
            $app_icon = $root_url.$app_icon;
        }

        $in_app_url = explode($root_url.$backend_url.'/'.$app_id.'/', $url, 2)[1];

        return [
            'app_id' => $app_id,
            'entity_type' => null,
            'entity_image' => $app_icon,
            'entity_title' => $link_text,
            'entity_url' => $url,
            'entity_in_app_url' => $in_app_url,
        ];
    }

    protected function process()
    {
        if ($this->processed) {
            return;
        }

        $this->processed = true;

        $contact_ids = [];

        foreach($this->data as $code => &$link) {
            if (empty($link['entity_type']) && !empty($link['entity_in_app_url'])) {
                $app_id = $link['app_id'];
                if ($app_id == 'shop' && preg_match('~^products/(\d+)~', $link['entity_in_app_url'])) {
                    $link['entity_type'] = 'product';
                } else if ($app_id == 'shop' && preg_match('~^#/orders/([^/]+&)?id=(\d+)~', $link['entity_in_app_url'])) {
                    $link['entity_type'] = 'order';
                } else if ($app_id == 'crm' && preg_match('~^contact/(\d+)~', $link['entity_in_app_url'], $m)) {
                    $link['entity_type'] = 'contact';
                    $contact_ids[$code] = $m[1];
                } else if ($app_id == 'crm' && preg_match('~^deal/(\d+)~', $link['entity_in_app_url'], $m)) {
                    $link['entity_type'] = 'deal';
                } else {
                    unset($this->data[$code]);
                }
            }
            unset($link['entity_in_app_url']);
        }
        unset($link);

        if ($contact_ids) {
            $default_contact = [
                'id' => 0,
                'photo' => 0,
                'is_company' => false,
            ];
            $collection = new waContactsCollection('id/'.join(',', $contact_ids));
            $contacts = $collection->getContacts('id,photo,is_company', 0, count($contact_ids));
            foreach($contact_ids as $code => $contact_id) {
                if (isset($this->data[$code])) {
                    $c = ifset($contacts, $contact_id, $default_contact);
                    $this->data[$code]['entity_image'] = waContact::getPhotoUrl($c['id'], $c['photo'], null, null, ($c['is_company'] ? 'company' : 'person'));
                }
            }
        }
    }

}

// helper class to access protected method
class tasksLinksPrettifierParsedownHelper extends tasksParsedown {
    public static function parseLink($markdown_code) {
        return (new self())->inlineLink(['text' => $markdown_code]);
    }
}
