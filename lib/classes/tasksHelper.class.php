<?php

class tasksHelper
{
    protected static $static_cache = [];

    protected static function getAvailableStatusIds()
    {
        static $status_ids;

        if ($status_ids === null) {
            $projects = self::getProjects();
            if ($projects) {
                $status_model = new tasksStatusModel();
                $status_ids = $status_model->getAvailableStatusIds(array_keys($projects));
            } else {
                $status_ids = [];
            }
        }

        return $status_ids;
    }

    /**
     * @param string $type active|archive|managed|available|active_available|all
     *
     * @return array
     */
    public static function getProjects($type = 'active_available')
    {
        $all_projects = ifset(self::$static_cache['all_projects']);
        $related_projects = ifset(self::$static_cache['related_projects']);

        if ($all_projects === null) {
            $project_model = new tasksProjectModel();
            $all_projects = $project_model->select('*')->order('archive_datetime DESC, sort DESC, name')->fetchAll(
                'id'
            );
            foreach ($all_projects as &$p) {
                $p = self::extendIcon($p);
            }
            unset($p);
            self::$static_cache['all_projects'] = $all_projects;
        }

        $projects = $all_projects;
        if ($type != 'all') {
            $is_admin = wa()->getUser()->isAdmin('tasks');
            if ($is_admin) {
                $is_available = array_fill_keys(array_keys($all_projects), 2);
            } else {
                $is_available = wa()->getUser()->getRights('tasks', 'project.%');
                if (!empty($is_available['all'])) {
                    $is_available = array_fill_keys(array_keys($all_projects), $is_available['all']);
                }
            }
            foreach ($projects as $id => $p) {
                $skip = empty($is_available[$id]);
                $skip = $skip || (($type == 'active' || $type == 'active_available') && $p['archive_datetime']);
                $skip = $skip || ($type == 'archive' && !$p['archive_datetime']);
                $skip = $skip || ($type == 'managed' && ifset($is_available[$id], 0) < 2);
                $skip = $skip || (($type == 'available' || $type == 'active_available') && ifset(
                            $is_available[$id],
                            0
                        ) < 1);
                if ($skip) {
                    unset($projects[$id]);
                }
            }
        }
        if ($type != 'archive') {
            // related project to top
            if ($related_projects === null) {
                $log_model = new tasksTaskLogModel();
                $related_projects = $log_model->getRelatedProjects(wa()->getUser()->getId());
                self::$static_cache['related_projects'] = $related_projects;
            }
            $result = [];
            foreach ($related_projects as $id) {
                if (isset($projects[$id])) {
                    $result[$id] = $projects[$id];
                }
            }
            foreach ($projects as $id => $p) {
                if (!isset($result[$id])) {
                    $result[$id] = $p;
                }
            }

            return $result;
        }

        return $projects;
    }

    public static function extendIcon($item)
    {
        $title = ' title="' . htmlentities($item['name'], ENT_QUOTES, 'utf-8') . '"';
        if (empty($item['icon'])) {
            $item['icon'] = 'unknown';
        }
        if (strpos($item['icon'], '.')) {
            $item['icon_class'] = false;
            $item['icon_url'] = $item['icon'];
            if (wa()->whichUI() == '2.0') {
                $item['icon_html'] = '<i class="icon" style="background-image: url(\'' . $item['icon'] . '\'); background-repeat: no-repeat; background-size: 16px; background-position: center center;"' . $title . '></i>';
            } else {
                $item['icon_html'] = '<i class="icon16" style="background-image: url(\'' . $item['icon'] . '\'); background-repeat: no-repeat; background-size: 16px; background-position: center center;"' . $title . '></i>';
            }
        } else {
            $item['icon_url'] = false;
            $item['icon_class'] = $item['icon'];
            if (wa()->whichUI() == '2.0') {
                $item['icon_html'] = '<i class="icon ' . $item['icon'] . '"' . $title . '></i>';
            } else {
                $item['icon_html'] = '<i class="icon16 ' . $item['icon'] . '"' . $title . '></i>';
            }
        }

        return $item;
    }

    /**
     * @param int $project_id
     * @param bool $only_active
     *
     * @return array
     */
    public static function getStatuses($project_id = null, $only_active = true)
    {
        static $statuses_by_project = [];
        if ($project_id) {
            if (!isset($statuses_by_project[$project_id])) {
                $model = new tasksProjectStatusesModel();
                $statuses_by_project[$project_id] = $model->getStatuses($project_id);
            }

            return $statuses_by_project[$project_id];
        }

        static $statuses = null;
        $status_model = new tasksStatusModel();
        if ($statuses === null) {
            $defaults = $status_model->getEmptyRow() + [
                    'params' => [],
                    'special' => 0,
                ];
            $statuses = [];
            $statuses[0] = [
                'id' => 0,
                'name' => _w('Open'),
                'button' => '',
                'special' => 1,
                'icon' => 'status-green-tiny',
            ];
            $statuses += $status_model->getAll('id');
            $statuses[-1] = [
                'id' => -1,
                'name' => _w('Closed'),
                'button' => _w('Closed'),
                'action_name' => _w('done'),
                'special' => 1,
                'icon' => 'done-bw',
            ];
            foreach ($statuses as $id => $s) {
                $statuses[$id] = self::extendIcon($statuses[$id] + $defaults);
            }

            $status_params_model = new tasksStatusParamsModel();
            foreach ($status_params_model->getAll() as $row) {
                if (!empty($statuses[$row['status_id']])) {
                    $statuses[$row['status_id']]['params'][$row['name']] = $row['value'];
                }
            }
        }
        if ($only_active) {
            $result = [];
            $available_status_ids = array_fill_keys(self::getAvailableStatusIds(), 1);
            foreach ($statuses as $s_id => $s) {
                if ($s_id <= 0 || isset($available_status_ids[$s_id])) {
                    $result[$s_id] = $s;
                }
            }

            return $result;
        }

        return $statuses;
    }

    public static function workupStatusesForView(&$statuses)
    {
        foreach ($statuses as &$status) {

            // view supplies (styles, properties, etc.)
            $status['view'] = [];

            if (!empty($status['params']['button_color'])) {
                $color = $status['params']['button_color'];
                $buttonClassName = 'yellow';
            } else {
                $color = 'eeeeee';
                $buttonClassName = 'light-gray';
            }

            if (wa()->whichUI() == '2.0') {
                $status['view']['button_html'] = '<a ' .
                    'href="javascript:void(0);" ' .
                    'class="button t-control-link t-change-status-link ' . $buttonClassName . '" data-status-id="' . $status['id'] . '"' .
                    // 'style="background-color:#'.$color.'"'.
                    '><span class="t-change-status-link-label">' . htmlspecialchars($status['button']) . '</span></a>';
            } else {
                $status['view']['button_html'] = '<a ' .
                    'href="javascript:void(0);" ' .
                    'class="t-control-link t-change-status-link" data-status-id="' . $status['id'] . '"' .
                    'style="background-color:#' . $color . '"' .
                    '><span class="t-change-status-link-label">' . htmlspecialchars($status['button']) . '</span></a>';
            }
        }
        unset($status);
    }

    /**
     * @return array|null
     * @deprecated
     * This method not-deprecated up to version 1.2.0
     */
    public static function getFavoriteTags()
    {
        static $result = null;
        if ($result == null) {
            $tag_model = new tasksTagModel();
            $result = $tag_model->select('id,name')->where('favorite')->order('name')->fetchAll('id', true);
        }

        return $result;
    }

    public static function getTaskPath($task_id, $create = false)
    {
        $str = str_pad($task_id, 4, '0', STR_PAD_LEFT);
        $path = 'tasks/' . substr($str, -2) . '/' . substr($str, -4, 2) . '/' . $task_id . '/';

        return wa()->getDataPath($path, false, 'tasks', $create);
    }

    public static function getRedactorImagesPath($taskUuid): string
    {
        return sprintf('img/%s/%s/', substr($taskUuid, 0, 2), $taskUuid);
    }

    public static function getRedactorImagesDataPath($taskUuid, $create = false): string
    {
        return wa()->getDataPath(self::getRedactorImagesPath($taskUuid), true, 'tasks', $create);
    }

    public static function getRedactorImagesUrl($taskUuid, $absolute = false): string
    {
        return wa()->getDataUrl(self::getRedactorImagesPath($taskUuid), true, 'tasks', $absolute);
    }

    public static function getAttachPreviewUrl($attach, $absolute = false)
    {
        $str = str_pad($attach['task_id'], 4, '0', STR_PAD_LEFT);
        $path = 'tasks/' . substr($str, -2) . '/' . substr(
                $str,
                -4,
                2
            ) . '/' . $attach['task_id'] . '/' . $attach['id'] . '.' . ifset(
                $attach['code'],
                '_'
            ) . '.600.' . $attach['ext'];

        return wa()->getDataUrl($path, true, 'tasks', $absolute);
    }

    public static function getAttachPath($attach)
    {
        $path = self::getTaskPath($attach['task_id'], true) . 'attachments/';
        waFiles::create($path);

        return $path . $attach['id'] . ($attach['ext'] ? '.' . $attach['ext'] : '');
    }

    public static function getTeam($project_id = null, $only_active = false)
    {
        static $contacts = null;

        //Model
        $rights_model = new waContactRightsModel();
        $contact_model = new waContactModel();
        $log_model = new tasksTaskLogModel();

        if ($project_id || ($contacts === null)) {
            $data = [];
            $contact_ids = $rights_model->getUsers('tasks', $project_id ? 'project.' . $project_id : 'backend');

            if ($contact_ids) {
                $data = $contact_model->getById($contact_ids);

                foreach ($data as $contact_id => $c) {
                    $data[$contact_id]['name'] = self::formatName($c);
                    $data[$contact_id]['is_active'] = false;
                }

                uasort($data, wa_lambda('$a,$b', 'return strcmp($a["name"],$b["name"]);'));

                $contact_ids = $log_model->getRelatedContactIds(wa()->getUser()->getId(), $project_id);
                if ($contact_ids) {
                    $tmp = [];
                    foreach ($contact_ids as $contact_id) {
                        if (isset($data[$contact_id])) {
                            $tmp[$contact_id] = $data[$contact_id];
                            $tmp[$contact_id]['is_active'] = true;
                        }
                    }
                    uasort($tmp, wa_lambda('$a,$b', 'return strcmp($a["name"],$b["name"]);'));
                    foreach ($data as $contact_id => $contact) {
                        if (!isset($tmp[$contact_id])) {
                            $tmp[$contact_id] = $contact;
                        }
                    }
                    $data = $tmp;
                }
            }
            if (!$project_id) {
                $contacts = $data;
            }
        } else {
            $data = $contacts;
        }
        if ($only_active) {
            $contact_ids = $log_model->getContactIds();
            $result = [];
            $user_id = wa()->getUser()->getId();
            foreach ($data as $contact_id => $c) {
                if (in_array($contact_id, $contact_ids) && $contact_id != $user_id) {
                    $result[$contact_id] = $c;
                }
            }

            return $result;
        }

        return $data;
    }

    /**
     * @param array|waContact $contact
     *
     * @return string
     */
    public static function formatName($contact)
    {
        if (!is_array($contact) && !($contact instanceof waContact)) {
            return '';
        }
        $format_name = wa('tasks')->getConfig()->getOption('format_name');
        if (!$format_name) {
            $format_name = [
                'firstname' => true,
                'middlename' => false,
                'lastname' => true,
            ];
        }

        $name = [];
        foreach ($format_name as $part => $status) {
            if ($status && !empty($contact[$part])) {
                if (($part = trim($contact[$part])) || $part === '0') {
                    $name[] = $part;
                }
            }
        }

        $name = trim(implode(' ', $name));
        if (!$name && $name !== '0') {
            $email = '';
            if ($contact instanceof waContact) {
                $email = $contact->get('email', 'default');
            } elseif (!empty($contact['email'])) {
                $email = $contact['email'];
                if (is_array($email)) {
                    if (isset($email['value'])) {
                        $email = $email['value'];
                    } else {
                        $email = array_shift($email);
                        if (is_array($email) && isset($email['value'])) {
                            $email = $email['value'];
                        } else {
                            if (!is_string($email)) {
                                $email = '';
                            }
                        }
                    }
                } else {
                    if (!is_string($email)) {
                        $email = '';
                    }
                }
            }
            $name = strtok($email, '@');
        }
        if (!$name && !empty($contact['name'])) {
            $name = $contact['name'];
        }

        return $name;
    }

    public static function getStatusHeaderStyles($status)
    {
        $style = [];
        if (!empty($status['params']['title_color'])) {
            $color = $status['params']['title_color'];
        } else {
            $color = '000';
        }
        $style[] = 'color:#' . htmlspecialchars($color);
        if (!empty($status['params']['title_style_italic'])) {
            $style[] = 'font-style:italic';
        }
        if (!empty($status['params']['title_style_bold'])) {
            $style[] = 'font-weight:bold';
        }

        return join(';', $style);
    }

    public static function statusNameHTML($status_id)
    {
        $statuses = self::getStatuses(null, false);
        if (!isset($status_id)) {
            return '';
        } else {
            if (empty($statuses[$status_id])) {
                return sprintf_wp('unknown status_id=%d', $status_id);
            }
        }
        $s = $statuses[$status_id];

        return '<span style="' . self::getStatusHeaderStyles($s) . '">' . htmlspecialchars($s['name']) . '</span>';
    }

    /**
     * @param int|string $timestamp - unix timestamp or datetime Y-m-d H:i:s
     *
     * @return string
     */
    public static function getDatetime($timestamp, &$period = null, &$string = null)
    {
        if (!is_numeric($timestamp)) {
            $timestamp = strtotime($timestamp);
        }

        $period = 60;
        $string = _w('%d min', '%d mins', 5, false);

        $timestamp = time() - $timestamp;
        if ($timestamp < 60) {
            return _w('Just now');
        } elseif ($timestamp < 3600) {
            return _w('%d min', '%d mins', round($timestamp / 60));
        } elseif ($timestamp < 24 * 3600) {
            $period = 3600;
            $string = _w('%d hr', '%d hrs', 5, false);

            return _w('%d hr', '%d hrs', round($timestamp / 3600));
        } elseif ($timestamp < 30 * 24 * 3600) {
            $period = 24 * 3600;
            $string = _w('%d d');

            return sprintf(_w('%d d'), round($timestamp / (24 * 3600)));
        } elseif ($timestamp < 365 * 24 * 3600) {
            $period = 30 * 24 * 3600;
            $string = _w('%d mo', '%d mo', 5, false);

            return _w('%d mo', '%d mo', round($timestamp / (30 * 24 * 3600)));
        } else {
            $period = 365 * 24 * 3600;
            $string = _w('%d yr', '%d yrs', 5, false);

            return _w('%d yr', '%d yrs', round($timestamp / (365 * 24 * 3600)));
        }
    }

    public static function addLog($task, $log, $send_notification = true)
    {
        $log_model = new tasksTaskLogModel();

        if (isset($log['assigned_contact_id'])) {
            if (!$log['assigned_contact_id']) {
                $log['assigned_contact_id'] = null;
            }
        } else {
            $log['assigned_contact_id'] = $task['assigned_contact_id'];
        }
        $log['project_id'] = $task['project_id'];
        $log['task_id'] = $task['id'];
        $log['before_status_id'] = $task['status_id'];
        if (isset($log['status_id']) && wa_is_int($log['status_id'])) {
            $log['after_status_id'] = $log['status_id'];
        } else {
            $log['after_status_id'] = $task['status_id'];
        }

        $do_not_update_datetime = !empty($log['do_not_update_datetime']);
        unset($log['do_not_update_datetime']);
        unset($log['status_id']);

        $log_id = $log_model->add($log);
        $log = $log_model->getById($log_id);

        $update = self::updateTaskByLogInfo($log, $task, $do_not_update_datetime);

        if ($send_notification) {
            $log['text'] = (string) $log['text'];
            $log['attach_count'] = $log_model->countAttachments($log['id']);

            $not_empty_log_item = strlen($log['text']) > 0 || $log['attach_count'] > 0;

            $actions = [];

            if (!empty($update['assigned_contact_id'])) {
                $actions[] = 'assign';
            } elseif ($not_empty_log_item) {
                $actions[] = 'comment';
            }

            if (!empty($update['status_id']) && $update['status_id'] == -1) {
                $actions[] = 'done';
            } elseif ($not_empty_log_item) {
                $actions[] = 'comment';
            }

            if ($actions) {
                $sender = new tasksNotificationsSender($task['id'], $actions);
                $sender->send();
            }
        }

        $event_params = [
            'task' => $task,
            'log' => $log,
        ];
        wa('tasks')->event('task_log_add', $event_params);

        return $log;
    }

    /**
     * @param $log
     * @param $task
     * @param $do_not_update_datetime
     *
     * @return array
     */
    protected static function updateTaskByLogInfo($log, $task, $do_not_update_datetime)
    {
        $log_id = $log['id'];
        $update = [];
        if ($log['after_status_id'] != $task['status_id']) {
            $update['status_id'] = $log['after_status_id'];
            if ($update['status_id'] == -1) {
                $update['assigned_contact_id'] = null;
                $update['assign_log_id'] = null;
            }
        }
        if (!empty($log['assigned_contact_id'])) {
            if ($log['assigned_contact_id'] != $task['assigned_contact_id']) {
                $update['assigned_contact_id'] = $log['assigned_contact_id'];
                $update['assign_log_id'] = $log_id;
            }
        } elseif (!isset($log['assigned_contact_id']) && array_key_exists('assigned_contact_id', $log)) {
            $update['assigned_contact_id'] = null;
        }

        // update contact_id
        $contact_id = wa()->getUser()->getId();
        if ((!$log['action'] || $log['action'] == 'forward' || $log['action'] == 'return') && $task['contact_id'] != $contact_id) {
            $update['contact_id'] = $contact_id;
        }

        if ($update) {
            if ($do_not_update_datetime) {
                $update['update_datetime'] = false;
            }
            $task_model = new tasksTaskModel();
            $task_model->updateById($task['id'], $update);
        }

        return $update;
    }


    /**
     * Work up list of tasks before send to view layer
     *
     * @param array[]|tasksTask[] $tasks
     */
    public static function workupTasksForView(&$tasks)
    {
        $contact_id = wa()->getUser()->getId();
        $rights = new tasksRights();

        $rights->extendTasksByRightsInfo($tasks, $contact_id);

        $milestone_ids = [];
        foreach ($tasks as &$task) {
            if (isset($task['log']) && !empty($task['log'])) {
                $log = $task['log'];
                $rights->extendLogItemsByRightsInfo($log, $contact_id);
                $task['log'] = $log;
            }

            // view supplies (styles, properties, etc.)
            $task_view = [
                'due_color_class' => '',
                'due_text' => '',
            ];

            $task['days_left'] = '';
            if ($task['due_date']) {
                $task['days_left'] = self::calcDatesDiffInDays($task['due_date'], 'today');
                $task_view['due_text'] = self::formatDueText($task['days_left']);
                $task_view['due_color_class'] = self::formatDueColor($task['days_left']);
            }

            $task['view'] = $task_view;

            if ($task['milestone_id'] > 0) {
                $milestone_ids[] = $task['milestone_id'];
            }
        }
        unset($task);

        $mm = new tasksMilestoneModel();
        $milestones = $mm->getById($milestone_ids);
        tasksMilestoneModel::workup($milestones);
        foreach ($tasks as &$task) {
            $task['milestone'] = null;
            if (isset($milestones[$task['milestone_id']])) {
                $task['milestone'] = $milestones[$task['milestone_id']];
            }
        }
        unset($task);

    }

    /**
     * Subtract second date from first
     *
     * @see http://php.net/manual/ru/datetime.formats.relative.php
     *
     * @param string $date1 'Y-m-d' or supported relative format
     * @param string $date2 'Y-m-d' or supported relative format
     *
     * Input params force typecast to date, all time parts throw aways
     *
     * @return int|false FALSE if something wrong
     */
    public static function calcDatesDiffInDays($date1, $date2)
    {
        $dates = [$date1, $date2];
        foreach ($dates as &$date) {
            $ts = strtotime($date);
            if ($ts === false || $date < 0) {
                return false;
            }
            $date = date('Y-m-d 00:00:00', $ts);
        }
        unset($date);

        [$date1, $date2] = $dates;

        $diff = (strtotime($date1) - strtotime($date2)) / 86400; // 24*3600

        return (int) $diff;
    }

    public static function formatDueText($days_left)
    {
        if ($days_left == 0) {
            return _w('Today');
        } elseif ($days_left == -1) {
            return _w('Yesterday');
        } elseif ($days_left == 1) {
            return _w('Tomorrow');
        } elseif ($days_left > 0) {
            return _w("%d day left", "%d days left", $days_left);
        } else {
            return _w("%d day overdue", "%d days overdue", abs($days_left));
        }
    }

    public static function formatDueColor($days_left)
    {
        if ($days_left < 0) {
            return 'red';
        } elseif ($days_left == 0) {
            return 'orange';
        } else {
            return 'green';
        }
    }

    /**
     * Cast to array of integers
     *
     * @param mixed $val
     *
     * @return int[]
     */
    public static function toIntArray($val)
    {
        $callback = 'return is_scalar($i) ? intval($i) : 0;';
        $callback = wa_lambda('$i', $callback);
        if (!is_scalar($val) && !is_array($val)) {
            $val = [];
        }

        return array_map($callback, (array) $val);
    }

    /**
     * Cast to array of strings
     *
     * @param mixed $val
     * @param bool  $trim
     *
     * @return string[]
     */
    public static function toStrArray($val, $trim = true)
    {
        $callback = 'return is_scalar($s) ? strval($s) : "";';
        if ($trim === true) {
            $callback = 'return is_scalar($s) ? trim(strval($s)) : "";';
        }
        $callback = wa_lambda('$s', $callback);
        if (!is_scalar($val) && !is_array($val)) {
            $val = [];
        }

        return array_map($callback, (array) $val);
    }

    /**
     * Drop all not positive values from input array
     *
     * @param array [int] $int_array
     *
     * @return array[int]
     */
    public static function dropNotPositive($int_array)
    {
        foreach ($int_array as $index => $int) {
            if ($int <= 0) {
                unset($int_array[$index]);
            }
        }

        return $int_array;
    }

    /**
     * @param string $str
     * @param array  $replace key => value replace map
     *
     * @return string
     */
    public static function strReplace($str, $replace)
    {
        return str_replace(array_keys($replace), array_values($replace), $str);
    }

    public static function getProfileURL($contact_id)
    {
        $active_app = wa()->getConfig()->getApplication();
        if (wa()->appExists('team')) {
            $url = wa('team', 1)->getAppUrl() . 'id/' . $contact_id;
        } elseif (wa()->appExists('contacts')) {
            $url = wa('contacts', 1)->getAppUrl() . '#/contact/' . $contact_id;
        } else {
            $url = '';
        }

        wa($active_app, 1);

        return $url;
    }

}
