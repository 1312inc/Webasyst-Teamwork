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
    protected $options;

    protected $processed = false;
    protected $data;

    protected static $team;

    public function __construct(?array $options = null)
    {
        $this->options = ifset($options, []);
    }

    public function addFromMarkdown($task_markdown_code)
    {
        // @-mentioned users
        $users = tasksTask::getAllMentionedUsers($task_markdown_code);
        foreach($users as $user) {
            $this->addMention($user);
        }

        // Links to orders, deals, contacts, etc.
        if (preg_match_all('~\\[[^\\]]+\\]\\([^\\)]+\\)~', $task_markdown_code, $matches)) {
            foreach($matches[0] as $link_markdown_code) {
                $this->addLink($link_markdown_code);
            }
        }

        // #tags
        $tags = tasksTask::extractTags($task_markdown_code);
        foreach($tags as $tag) {
            $this->addTag($tag);
        }

        // task numbers #11.2222
        $task_numbers = tasksTask::extractTaskNumbers($task_markdown_code);
        $tasks = $this->getTasks($task_numbers);
        foreach($tasks as $task) {
            $this->addTask($task);
        }

        return $this;
    }

    protected function getTasks($task_numbers)
    {
        if (!$task_numbers) {
            return [];
        }

        $task_model = new tasksTaskModel();

        $params_where = $where = [];
        foreach ($task_numbers as $number) {
            $number_parse = explode('.', $number);
            $where[] = '(project_id = ? AND number = ?)';
            $params_where = array_merge($params_where, $number_parse);
        }

        return $task_model
            ->select('id, project_id, number, name')
            ->where(implode(' OR ', $where), $params_where)
            ->fetchAll('id');
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

        if (!empty($this->options['absolute_urls'])) {
            if (!empty($link['entity_url']) && substr($link['entity_url'], 0, 4) !== 'http') {
                $link['entity_url'] = wa()->getConfig()->getHostUrl().$link['entity_url'];
            }
        }

        $link['markdown_code'] = "[{$link['entity_title']}]({$link['entity_url']})";
        $this->data[$markdown_code] = $link;
        return true;
    }

    public function addMention($user)
    {
        if ($this->processed) {
            throw new waException('Unable to add more mentions after ->getData()');
        }

        $login = $user['login'];
        $name = waContactNameField::formatName($user);
        if ($name === $login) {
            $name = '@'.$name;
        }

        $root_url = wa()->getConfig()->getRootUrl(true);
        $backend_url = wa()->getConfig()->getBackendUrl(false);

        $this->data['@'.$login] = [
            'app_id' => 'tasks',
            'entity_type' => 'user',
            'entity_id' => $user['id'],
            'entity_image' => waContact::getPhotoUrl($user['id'], $user['photo'], null, null, ($user['is_company'] ? 'company' : 'person')),
            'entity_title' => $name,
            'entity_link_name' => '@'.$login,
            'entity_url' => $root_url.$backend_url."/team/u/{$login}/",
            'user_login' => $login,
        ];

        return true;
    }

    public function addTag($tag)
    {
        $this->data['#'.$tag] = [
            'app_id' => 'tasks',
            'entity_type' => 'tag',
            'entity_image' => null,
            'entity_title' => htmlspecialchars($tag),
            'entity_url' => wa()->getAppUrl('tasks')."#/tasks/tag/{$tag}/",
        ];
    }

    public function addTask($task)
    {
        $project_id = $task['project_id'];
        $task_number = $task['number'];

        $this->data["#{$project_id}.{$task_number}"] = [
            'app_id' => 'tasks',
            'entity_type' => 'task',
            'entity_id' => $task['id'],
            'entity_image' => null,
            'entity_title' => "{$project_id}.{$task_number} {$task['name']}",
            'entity_link_name' => "#{$project_id}.{$task_number}",
            'entity_url' => wa()->getAppUrl('tasks')."#/task/{$project_id}.{$task_number}/",
        ];
    }

    // used by autocomplete controllers
    public function addEntity($entity)
    {
        if (empty($entity['app_id']) || empty($entity['entity_type']) || empty($entity['entity_url']) || !isset($entity['entity_title'])) {
            throw new waException('entity not supported '.wa_dump_helper($entity));
        }

        $code = "[{$entity['entity_title']}]({$entity['entity_url']})";
        $this->data[$code] = $entity;
    }

    public function getData()
    {
        $this->process();
        return $this->data;
    }

    public function count()
    {
        return $this->data ? count($this->data) : 0;
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
            'entity_title' => htmlspecialchars($link_text),
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
        if (empty($this->data)) {
            $this->data = [];
            return;
        }

        $apps_info = wa()->getApps();
        $root_url = wa()->getConfig()->getRootUrl(false);
        $host_url = wa()->getConfig()->getHostUrl();

        $contact_ids = [];

        foreach($this->data as $code => &$link) {
            if (empty($link['app_id']) || !isset($link['entity_title'])) {
                unset($this->data[$code]);
                continue;
            }
            $app_id = $link['app_id'];
            if (!empty($link['entity_in_app_url'])) {
                list($entity_type, $entity_id) = self::getEntityType($app_id, $link['entity_in_app_url']);
                if (empty($link['entity_type'])) {
                    $link['entity_type'] = $entity_type;
                }
                if (empty($link['entity_id'])) {
                    $link['entity_id'] = $entity_id;
                }
                if ($entity_type == 'contact') {
                    $contact_ids[$code] = $entity_id;
                }
            }
            unset($link['entity_in_app_url']);
            if (empty($link['entity_type'])) {
                unset($this->data[$code]);
                continue;
            }

            if (!isset($link['entity_image']) && $app_id) {
                $link['entity_image'] = $root_url.ifset($apps_info, $app_id, 'icon', 48, null);
            }
            if (!isset($link['entity_id'])) {
                $link['entity_id'] = null;
            }

            if (!isset($link['markdown_code'])) {
                $link['markdown_code'] = $code;
            }
            if (!isset($link['entity_link_name'])) {
                $link['entity_link_name'] = $link['entity_title'];
            }

            if (!empty($this->options['absolute_urls'])) {
                if (!empty($link['entity_image']) && substr($link['entity_image'], 0, 4) !== 'http') {
                    $link['entity_image'] = $host_url.$link['entity_image'];
                }
                if (!empty($link['entity_url']) && substr($link['entity_url'], 0, 4) !== 'http') {
                    $link['entity_url'] = $host_url.$link['entity_url'];
                }
            }
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
                    $contact_photo_url = waContact::getPhotoUrl($c['id'], $c['photo'], null, null, ($c['is_company'] ? 'company' : 'person'));
                    if (!empty($this->options['absolute_urls'])) {
                        $contact_photo_url = $host_url.$contact_photo_url;
                    }
                    $this->data[$code]['entity_image'] = $contact_photo_url;
                }
            }
        }
    }

    protected static function getEntityType($app_id, $in_app_url)
    {
        if ($app_id == 'shop' && preg_match('~^products/(\d+)~', $in_app_url, $m)) {
            return ['product', $m[1]];
        } else if ($app_id == 'shop' && preg_match('~^#/orders/([^/]+&)?id=(\d+)~', $in_app_url, $m)) {
            return ['order', $m[1]];
        } else if ($app_id == 'helpdesk' && preg_match('~^#/request/(\d+)~', $in_app_url, $m)) {
            return ['request', $m[1]];
        } else if ($app_id == 'hub' && preg_match('~^#/topic/(?:edit/)?(\d+)~', $in_app_url, $m)) {
            return ['topic', $m[1]];
        } else if ($app_id == 'crm' && preg_match('~^contact/(\d+)~', $in_app_url, $m)) {
            return ['contact', $m[1]];
        } else if ($app_id == 'crm' && preg_match('~^deal/(\d+)~', $in_app_url, $m)) {
            return ['deal', $m[1]];
        }
    }


}

// helper class to access protected method
class tasksLinksPrettifierParsedownHelper extends tasksParsedown {
    public static function parseLink($markdown_code) {
        return (new self())->inlineLink(['text' => $markdown_code]);
    }
}
