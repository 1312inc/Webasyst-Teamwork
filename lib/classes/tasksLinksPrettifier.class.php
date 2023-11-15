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

    public static function factory($task_markdown_code)
    {
        $result = new self();

        $users = tasksTask::getAllMentionedUsers($task_markdown_code);
        foreach($users as $user) {
            $result->addMention($user);
        }

        if (preg_match_all('~\\[[^\\]]+\\]\\([^\\)]+\\)~', $task_markdown_code, $matches)) {
            foreach($matches[0] as $link_markdown_code) {
                $result->addLink($link_markdown_code);
            }
        }

        return $result;
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

    public function addMention($login_or_data)
    {
        if ($this->processed) {
            throw new waException('Unable to add more mentions after ->getData()');
        }

        if (is_array($login_or_data)) {
            $data = $login_or_data;
            $login = $data['login'];
        } else {
            $login = $login_or_data;
            $data = null;
        }

        $this->data['@'.$login] = [
            'app_id' => 'tasks',
            'entity_type' => 'user',
            'entity_image' => null,
            'entity_title' => null,
            'entity_url' => wa()->getAppUrl('team')."u/{$login}/",
            'user_login' => $login,
            'user_data' => $data,
        ];
    }

    public function getData()
    {
        if (!$this->processed) {
            $this->process();
        }

        return $this->data;
    }

    protected function parseMarkdownLink($markdown_code)
    {
        $link = tasksLinksPrettifierParsedownHelper::parseLink($markdown_code);
        $url = ifset($link, 'element', 'attributes', 'href', null);
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

        return [
            'app_id' => $app_id,
            'entity_type' => null,
            'entity_image' => $app_icon,
            'entity_title' => null,
            'entity_url' => $url,
        ];
    }

    protected function process()
    {
        $this->processed = true;

        // !!!!
    }

}

// helper class to access protected method
class tasksLinksPrettifierParsedownHelper extends tasksParsedown {
    public static function parseLink($markdown_code) {
        return (new self())->inlineLink(['text' => $markdown_code]);
    }
}
