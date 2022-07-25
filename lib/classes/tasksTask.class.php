<?php

/**
 * Class tasksTask
 *
 * @property int $id
 * @property int $contact_id
 * @property int $create_contact_id
 * @property int $assigned_contact_id
 * @property string $name
 * @property string $uuid
 * @property string $text
 * @property string $project_id
 * @property waContact $contact
 * @property array $attachments
 * @property array $public_links
 */
class tasksTask implements ArrayAccess
{
    protected $data;
    /**
     * @var tasksTaskModel
     */
    protected $model;

    /**
     * @var tasksRights
     */
    protected $rights;

    protected static $data_storages;

    public function __construct($data=null)
    {
        $this->model = new tasksTaskModel();
        $this->data = $this->model->getEmptyRow();

        if ($data) {
            if (is_array($data)) {
                $task_info = $data;
            } elseif (wa_is_int($data)) {
                $task_info = $this->model->getById($data);
            } else {
                @list($project_id, $number) = explode('.', $data, 2);
                $task_info = $this->model->getByField(array(
                    'project_id' => (int) $project_id,
                    'number' => (int) $number,
                ));
            }
            if ($task_info) {
                $this->data = $task_info + $this->data;
            }
        }
    }

    public function exists()
    {
        return !empty($this->data['id']);
    }

    public function titleStyle()
    {
        return tasksHelper::getStatusHeaderStyles($this['status']);
    }

    public function buttonHtml($status_id = null)
    {
        if ($status_id === null) {
            if ($this['next_status']) {
                $status_id = $this['next_status']['id'];
            } else {
                return '';
            }
        }

        $statuses = tasksHelper::getStatuses(null, false);
        if (empty($statuses[$status_id])) {
            return '';
        }
        $status = $statuses[$status_id];
        $statuses = array($status);
        tasksHelper::workupStatusesForView($statuses);
        $status = reset($statuses);

        return $status['view']['button_html'];
    }

    public function hasStatusForm()
    {
        $status = $this->getNextStatus();
        return !empty($status['params']['allow_comment']) || ifset($status['params']['assign']) == 'select';
    }

    public function getRelations()
    {
       $relation_model = new tasksTaskRelationsModel();
       $task_relation = $relation_model->getRelations($this->id);

       return $task_relation;
    }

    public function getStatus()
    {
        $statuses = $this['project_statuses'];
        return ifset($statuses[$this['status_id']], array());
    }

    public function getNextStatus()
    {
        $statuses = $this['project_statuses'];
        reset($statuses);
        while(key($statuses) != $this['status_id'] && next($statuses)) {
            continue;
        }
        return next($statuses);
    }

    public function getProjectStatuses()
    {
        return tasksHelper::getStatuses($this['project_id']);
    }

    public function getProject()
    {
        $project_model = new tasksProjectModel();
        $project = $project_model->getById($this['project_id']);
        return tasksHelper::extendIcon($project);
    }

    public function getImages()
    {
        $images = array();
        foreach($this['all_attachments'] as $a) {
            if(empty($a['log_id']) && self::isImageAttachment($a)) {
                $images[] = $a;
            }
        }
        return $images;
    }

    public function getFiles()
    {
        $files = array();
        foreach($this['all_attachments'] as $a) {
            if(empty($a['log_id']) && !self::isImageAttachment($a)) {
                $files[] = $a;
            }
        }
        return $files;
    }

    public function getAttachments()
    {
        $files = array();
        foreach($this['all_attachments'] as $a) {
            if(empty($a['log_id'])) {
                $files[] = $a;
            }
        }
        return $files;
    }

    public function getLogAttachments($log_id)
    {
        $files = array();
        $images = array();
        foreach($this['all_attachments'] as $a) {
            if($a['log_id'] == $log_id) {
                if(self::isImageAttachment($a)) {
                    $images[] = $a;
                } else {
                    $files[] = $a;
                }
            }
        }
        return array(
            'images' => $images,
            'files' => $files,
        );
    }

    public static function isImageAttachment($attachment)
    {
        if (is_scalar($attachment)) {
            $ext = (string)$attachment;
        } elseif (is_array($attachment) && isset($attachment['ext'])) {
            $ext = (string)$attachment['ext'];
        } else {
            $ext = '';
        }
        return in_array(strtolower($ext), array('jpg', 'png', 'gif', 'jpeg'));
    }

    /**
     * Format text for view
     *
     * @param $text
     * @param array $options
     *
     *   'wrap_tags_in_links'
     *     - if true - implement wrapping tags in links with default options,
     *     - if array - implement wrapping tags in links with custom options
     *     - if false - ignore wrapping
     *     - if skipped - interprets true
     *
     *   'wrap_task_numbers_in_links'
     *     - if true - implement wrapping project numbers in links with default options,
     *     - if array - implement wrapping project numbers in links with custom options
     *     - if false - ignore wrapping
     *     - if skipped - interprets true
     *
     *   'escape'
     *     - if true - htmlspecailchars call before wrapping in links
     *
     *   'markdown'
     *     - if missed or not false - apply tasksParsedown parsing to text
     *     - if false - not apply tasksParsedown
     *
     * @see wrapTagsInLinks
     * @see wrapTaskNumbersInLinks
     * @see tasksParsedown
     *
     * @return string
     */
    public static function formatText($text, $options = [])
    {
        $options = is_array($options) ? $options : [];

        $key = md5(sprintf('%s||%s', $text, json_encode($options)));
        $cachedText = tsks()->getCache()->get($key);
        if ($cachedText !== null) {
            return $cachedText;
        }

        $options['wrap_tags_in_links'] = isset($options['wrap_tags_in_links']) ? $options['wrap_tags_in_links'] : true;
        $options['wrap_task_numbers_in_links'] = isset($options['wrap_task_numbers_in_links']) ? $options['wrap_task_numbers_in_links'] : true;
        $options['markdown'] = isset($options['markdown']) ? $options['markdown'] : true;

        $wrap_tags_in_links = false;
        if ($options['wrap_tags_in_links'] === true || is_array($options['wrap_tags_in_links'])) {
            $wrap_tags_in_links = is_array($options['wrap_tags_in_links']) ? $options['wrap_tags_in_links'] : [];
            if (!isset($wrap_tags_in_links['tags']) || !is_array($wrap_tags_in_links['tags'])) {
                $wrap_tags_in_links['tags'] = self::extractTags($text);
            }
        }

        $wrap_task_numbers_in_links = false;
        if ($options['wrap_task_numbers_in_links'] === true || is_array($options['wrap_task_numbers_in_links'])) {
            $wrap_task_numbers_in_links = is_array(
                $options['wrap_task_numbers_in_links']
            ) ? $options['wrap_task_numbers_in_links'] : [];
            if (!isset($wrap_task_numbers_in_links['task_numbers']) || !is_array(
                    $wrap_task_numbers_in_links['task_numbers']
                )) {
                $wrap_task_numbers_in_links['task_numbers'] = self::extractTaskNumbers($text);
            }
        }

        if ($options['markdown'] !== false) {
            $parser = new tasksParsedown();
            $parser->setBreaksEnabled(true);
            $parser->setMarkupEscaped(true);
            $text = $parser->text($text);
        }

        if (isset($options['escape']) && $options['escape'] === true) {
            $text = htmlspecialchars($text);
        }

        if ($wrap_tags_in_links) {
            $text = self::wrapTagsInLinks($text, $wrap_tags_in_links);
        }

        if ($wrap_task_numbers_in_links) {
            $text = self::wrapTaskNumbersInLinks($text, $wrap_task_numbers_in_links);
        }

        tsks()->getCache()->set($key, $text, 3600);

        return $text;
    }

    /**
     * Extract tags from text
     * @param string $text
     * @return array
     */
    public static function extractTags($text)
    {
        $pattern = self::getTagsInTextRegExpPattern();
        $has_tags = preg_match_all($pattern, $text, $m);
        if ($has_tags) {
            return array_map(static function ($tag) {
                return trim(str_replace("\xc2\xa0", ' ', $tag));
            }, $m[1]);
        }

        return [];
    }

    protected static function getTagsInTextRegExpPattern()
    {
        return "~
            # Make sure the tag is preceded by newline or whitespace.
            # Multiple '#'s are used in markdown for headers, # can be inside a URL, etc...
            (?:\s|^)

            # Start of a tag
            \#

            # Make sure it's not a number 
            (?![0-9]+)

            # Make sure it's not a link to task
            (?![0-9]+\.[0-9]+)

            # Make sure it's not a CSS color
            (?![0-9A-Fa-f]{3}\b|[0-9A-Fa-f]{6}\b)
            
            # This matches the tag name
            ([^\s/!?()[\],\.#<>'\"\\\\]+)
        ~xu";
    }

    /**
     * Extract tasks number from text
     * @param string $text
     * @return array
     */
    public static function extractTaskNumbers($text)
    {
        $pattern = self::getTaskNumbersRegExpPattern();
        $has_tags = preg_match_all($pattern, $text, $m);
        if ($has_tags) {
            return $m[1];
        }
        return array();
    }

    protected static function getTaskNumbersRegExpPattern()
    {
        return "~
            # Make sure the tag is preceded by newline or whitespace.
            # Multiple '#'s are used in markdown for headers, # can be inside a URL, etc...
            (?:\s|^)
        
            # Start of a tag
            \#
        
            # Task Number
            ([0-9]+\.[0-9]+) 
            
        ~x";
    }

    /**
     * For current text wrap tags in links
     * Tags in text looks like: #abc #bug #test #feature
     *
     * @param string $text
     * @param array $options
     *
     *   'tags'
     *     - if array - wrap only these tags
     *     - otherwise - wrap all tags in text
     *
     *   'url_pattern' - url pattern for link
     *     - for example: '#/someurl{$tag}/'
     *     - default pattern '#/tasks/tag/{$tag}/'
     *     - {$tag} placeholder for proper tag
     *
     *   'link_pattern' - html pattern for link
     *     - for example: '<a href="{$url}">#{$tag}</a>
     *     - default pattern: '<a href="{$url}" class="t-tag-link">#{$tag}</a>'
     *     - {$url} placeholder for proper tag url (see 'url_pattern')
     *     - {$tag} placeholder for proper tag
     * @return string
     */
    public static function wrapTagsInLinks($text, $options = array())
    {
        $options = is_array($options) ? $options : array();

        if (isset($options['tags']) && is_array($options['tags'])) {
            $tags = $options['tags'];
        } else {
            $tags = self::extractTags($text);
        }
        if (isset($options['url_pattern']) && is_string($options['url_pattern'])) {
            $url_pattern = $options['url_pattern'];
        } else {
            $url_pattern = '#/tasks/tag/{$tag}/';
        }

        if (isset($options['link_pattern']) && is_string($options['link_pattern'])) {
            $link_pattern = $options['link_pattern'];
        } else {
            $link_pattern = '<span class="break-word"><a href="{$url}" class="t-tag-link">#{$tag}</a></span>';
        }

        $link_pattern = str_replace('{$url}', $url_pattern, $link_pattern);

        $replace_map = array();
        $replace_map2 = array();
        foreach ($tags as $tag) {
            $link = str_replace('{$tag}', $tag, $link_pattern);
            $replace_map[sprintf('/#%s\b/',preg_quote($tag,'/'))] = $link;
            $replace_map2['#'.$tag] = $link;
        }

        $res = preg_replace(array_keys($replace_map), array_values($replace_map), $text);
        if (!$res) {
            $res = tasksHelper::strReplace($text, $replace_map2);
        }
        $text = $res;

        return $text;
    }

    /**
     * For current text wrap task numbers in links
     * Project numbers in text looks like: #10.123 #1.90 #22.442
     *
     * @param $text
     * @param array $options
     *
     *   'task_numbers'
     *     - if array - wrap only these task numbers
     *     - otherwise - wrap all task numbers in text
     *
     *   'url_pattern' - url pattern for link
     *     - for example: '#/someurl{$number}/'
     *     - default pattern '#/task/{$number}/'
     *     - {$number} placeholder for proper task number
     *
     *   'link_pattern' - html pattern for link
     *     - for example: '<a href="{$url}">#{$number}</a>
     *     - default pattern: '<a href="{$url}" class="t-task-link">#{$number}</a>'
     *     - {$url} placeholder for proper url (see 'url_pattern')
     *     - {$number} placeholder for proper task number
     *
     * @return string
     */
    public static function wrapTaskNumbersInLinks($text, $options = array())
    {
        if (isset($options['task_numbers']) && is_array($options['task_numbers'])) {
            $numbers = $options['task_numbers'];
        } else {
            $numbers = self::extractTaskNumbers($text);
        }
        if (isset($options['url_pattern']) && is_string($options['url_pattern'])) {
            $url_pattern = $options['url_pattern'];
        } else {
            $url_pattern = '#/task/{$number}/';
        }

        if (isset($options['link_pattern']) && is_string($options['link_pattern'])) {
            $link_pattern = $options['link_pattern'];
        } else {
            $link_pattern = '<span class="break-word"><a href="{$url}" class="t-task-link">#{$number}</a></span>';
        }
        $link_pattern = str_replace('{$url}', $url_pattern, $link_pattern);
        $link_pattern = str_replace('{$number}', '{$tag}', $link_pattern);

        return self::wrapTagsInLinks($text, array(
            'tags' => $numbers,
            'url_pattern' => $url_pattern,
            'link_pattern' => $link_pattern
        ));
    }

    /**
     * @return waContact
     */
    public function getContact()
    {
        return $this->getWaContactById($this->contact_id);
    }

    public function getPublicLinks(): array
    {
        return !empty($this->data['public_hash'])
            ? array_reduce(
                wa()->getRouting()->getDomains(),
                function ($carry, $domain) {
                    $carry[] = wa()
                        ->getRouting()
                        ->getUrl('/frontend', ['public_hash' => $this->data['public_hash']], true, $domain);

                    return $carry;
                }, [])
            : [];
    }

    /**
     * @return waContact
     */
    public function getCreateContact()
    {
        return $this->getWaContactById($this->create_contact_id);
    }

    /**
     * @return waContact
     */
    public function getAssignedContact()
    {
        $contact = $this->getWaContactById($this->assigned_contact_id);
        $contact['invited'] = null;
        $invited = tsks()->getModel('waAppTokens')
            ->getByField(['app_id' => 'team', 'contact_id' => $this->assigned_contact_id]);
        if ($invited) {
            $contact['invited'] = waAppTokensModel::getLink($invited['token']);
        }

        return $contact;
    }

    /**
     * @param int $id
     * @return waContact
     */
    protected function getWaContactById($id)
    {
        $c = new waContact($id);
        try {
            $c->getName();
        } catch (Exception $e) {
            $c = new waContact();
            $c['name'] = 'Deleted contact id='.$id;
            $c['delete'] = true;
        }
        return $c;
    }

    /**
     * @return int
     */
    public function getAssignmentCreatorId()
    {
        $log_item = $this->getAssignLogItem();
        return $log_item ? $log_item['contact_id'] : $this['create_contact_id'];
    }

    /**
     * @return waContact
     */
    public function getAssignmentCreator()
    {
        return $this->getWaContactById($this->getAssignmentCreatorId());
    }

    public function getFavorite()
    {
        $favorite_model = new tasksFavoriteModel();
        return $favorite_model->getByField(array('contact_id' => wa()->getUser()->getId(), 'task_id' => $this->id));
    }

    protected function getReturnLogItem()
    {
        $logs = $this['log'];

        if ($logs) {

            $current_assigned_contact_id = $this['assigned_contact_id'];

            $log_item = null;       // current log item in traversal
            $prev_log_item = null;  // previous log item in traversal
            $found_log_item = null; // found log item

            foreach(array_reverse($logs) as $log_item) {
                if ($log_item['assigned_contact_id'] != $current_assigned_contact_id) {
                    // first log item when assigned_contact_id was different
                    // so previous log item is log item when current assigned_contact_id has been set
                    $found_log_item = $prev_log_item;
                    break;
                }
                $prev_log_item = $log_item;
            }

            if (!$found_log_item) {
                $found_log_item = $log_item; // here now is first log item with 'create' action (have to at least)
            }

            return $found_log_item;

        }

        $log_model = new tasksTaskLogModel();
        return array(
            'task_id' => $this['id'],
            'before_status_id' => null,
            'after_status_id' => $this['status_id'],
            'create_datetime' => $this['create_datetime'],
            'contact_id' => $this['contact_id'],
            'action' => tasksTaskLogModel::ACTION_TYPE_ADD,
        ) + $log_model->getEmptyRow();
    }

    protected function getAssignLogItem()
    {
        $assign_log_id = $this['assign_log_id'];
        $assign_log_item = null;
        if ($assign_log_id > 0) {
            $log = $this->getLog();
            if (isset($log[$assign_log_id])) {
                $assign_log_item = $log[$assign_log_id];
            }
        }
        return $assign_log_item;
    }

    public function getReturnActor()
    {
        $return_log_item = $this['return_log_item'];
        $contact = $this->getWaContactById($return_log_item['contact_id']);
        if (!$contact->exists()) {
            return $this->getCreateContact();
        }
        return $contact;
    }

    public function getReturnStatus()
    {
        $statuses = $this['project_statuses'];
        $prev_status_id = $this['return_log_item']['before_status_id'];
        if ($prev_status_id === null || empty($statuses[$prev_status_id])) {
            return $statuses[0]; // new
        } else {
            return $statuses[$prev_status_id];
        }
    }

    public function canEdit($contact = null)
    {
        return $this->getRights()->canEditTask($this, $contact);
    }

    public function canDelete($contact = null)
    {
        return $this->getRights()->canDeleteTask($this, $contact);
    }

    public function canView($contact = null, $clarify = false)
    {
        return $this->getRights()->canViewTask($this, $contact, $clarify);
    }

    public function hasFullAccess($contact = null)
    {
        return $this->getRights()->hasFullAccessToTask($this, $contact);
    }

    /**
     * Executed on attempts to retrieve task property values.
     * @see http://www.php.net/manual/en/language.oop5.overloading.php
     *
     * @param string $name Property name
     * @return mixed|null Property value or null on failure
     */
    public function __get($name)
    {
        if (isset($this->data[$name])) {
            return $this->data[$name];
        }

        $method = "get".preg_replace_callback('@(^|_)([a-z])@', array(__CLASS__, 'camelCase'), $name);
        if (method_exists($this, $method)) {
            $this->data[$name] = $this->$method();
            return $this->data[$name];
        } elseif ($storage = $this->getStorage($name)) {
            $this->data[$name] = $storage->getData($this);
            return $this->data[$name];
        }
        return null;
    }

    private static function camelCase($m)
    {
        return strtoupper($m[2]);
    }

    public function setAll($data)
    {
        foreach ($data as $k => $v) {
            $this[$k] = $v;
        }
        return $this;
    }

    public function getLog()
    {
        $storage = $this->getStorage('log');
        $log = $storage->getData($this);
        /**
         * @event task_log
         */
        wa('tasks')->event('task_log', $log);
        return $log;
    }

    public function getTags()
    {
        $result = array();
        foreach($this['full_tags'] as $t) {
            $result[$t['id']] = $t['name'];
        }
        return $result;
    }

    public function getFavoriteTags()
    {
        $result = array();
        foreach($this['full_tags'] as $t) {
            if (!empty($t['favorite'])) {
                $result[$t['id']] = $t['name'];
            }
        }
        return $result;
    }

    /**
     * Get tags that not inside text of task, but associated with task
     * @return array of <tag_id> => <tag_name>
     */
    public function getSideTags()
    {
        $all_tags = $this->getTags();

        $inline_tags = tasksTask::extractTags($this['text']);
        $inline_tags = array_fill_keys($inline_tags, true);

        $side_tags = array();
        foreach ($all_tags as $tag_id => $tag_name) {
            if (!isset($inline_tags[$tag_name])) {
                $side_tags[$tag_id] = $tag_name;
            }
        }

        return $side_tags;
    }

    /**
     * Get tags that inside text of task
     * @return array of <tag_id> => <tag_name>
     */
    public function getInlineTags()
    {
        $all_tags = $this->getTags();

        $inline_tag_names = tasksTask::extractTags($this['text']);
        $inline_tag_names = array_fill_keys($inline_tag_names, true);

        $inline_tags = array();
        foreach ($all_tags as $tag_id => $tag_name) {
            if (isset($inline_tag_names[$tag_name])) {
                $inline_tags[$tag_id] = $tag_name;
            }
        }

        return $inline_tags;

    }

    /**
     * Executed on attempts to change task property values.
     * @see http://www.php.net/manual/en/language.oop5.overloading.php
     *
     * @param string $name Property name
     * @param mixed $value New value
     * @return mixed New value
     */
    public function __set($name, $value)
    {
        if ($name == 'name') {
            $value = preg_replace('@[\r\n\s]+@',' ',$value);
        }
        $this->data[$name] = $value;
        return $value;
    }

    /**
     * @return tasksRights
     */
    protected function getRights()
    {
        return $this->rights ? $this->rights : ($this->rights = new tasksRights());
    }

    /**
     * @param $key
     * @return tasksTaskLogModel|tasksTaskTagsModel|tasksAttachmentModel
     */
    private function getStorage($key)
    {
        if (!self::$data_storages) {
            self::$data_storages = array(
                'all_attachments' => 'tasksAttachmentModel',
                'full_tags' => 'tasksTaskTagsModel',
                'log' => 'tasksTaskLogModel',
            );
        }
        if (isset(self::$data_storages[$key])) {
            $storage = self::$data_storages[$key];
            if ($storage === true) {
                $storage = "tasks".ucfirst($key)."Model";
                $obj = new $storage();
                return self::$data_storages[$key] = $obj;
            } elseif (is_string($storage)) {
                return self::$data_storages[$key] = new $storage();
            } elseif (is_object(self::$data_storages[$key])) {
                return self::$data_storages[$key];
            }
        }
        return null;
    }


    /**
     * Whether a offset exists
     * @link http://php.net/manual/en/arrayaccess.offsetexists.php
     * @param mixed $offset an offset to check for.
     * @return boolean true on success or false on failure.
     * The return value will be casted to boolean if non-boolean was returned.
     */
    public function offsetExists($offset)
    {
        return isset($this->data[$offset]) || $this->model->fieldExists($offset) || $this->getStorage($offset) ||
            method_exists($this, "get".preg_replace_callback('@(^|_)([a-z])@', array(__CLASS__, 'camelCase'), $offset));
    }

    /**
     * Offset to retrieve
     * @link http://php.net/manual/en/arrayaccess.offsetget.php
     * @param mixed $offset The offset to retrieve.
     * @return mixed Can return all value types.
     */
    public function offsetGet($offset)
    {
        return $this->__get($offset);
    }

    /**
     * Offset to set
     * @link http://php.net/manual/en/arrayaccess.offsetset.php
     * @param mixed $offset The offset to assign the value to.
     * @param mixed $value The value to set.
     * @return void
     */
    public function offsetSet($offset, $value)
    {
        $this->__set($offset, $value);
    }

    /**
     * Offset to unset
     * @link http://php.net/manual/en/arrayaccess.offsetunset.php
     * @param mixed $offset The offset to unset.
     * @return void
     */
    public function offsetUnset($offset)
    {
        $this->__set($offset, null);
    }
}
