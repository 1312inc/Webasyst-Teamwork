<?php

class tasksNotifications
{
    public static function sendBulk($event, $count, waContact $to, $comment = '')
    {
        $email = $to->get('email', 'default');
        if (!$email) {
            return;
        }
        if ($to->getId() == wa()->getUser()->getId()) {
            return;
        }

        $template_path = wa()->getAppPath('templates/mail/Bulk' . ucfirst($event) . '.html', 'tasks');
        if (!file_exists($template_path)) {
            return;
        }

        if ($comment) {
            $comment = tasksTask::formatText($comment);
        }

        $body = self::renderTemplate($template_path, [
            'count' => $count,
            'comment' => $comment,
            'inbox_url' => wa()->getRootUrl(true) . wa()->getConfig()->getBackendUrl() . "/tasks/#/tasks/inbox/",
            'from' => wa()->getUser(),
            'to' => $to,
        ]);

        switch ($event) {
            case 'assign':
                $subject = _w(
                    'ASSIGNED: %d task was assigned to you',
                    'ASSIGNED: %d tasks were assigned to you',
                    $count
                );
                break;
            case 'done':
                $subject = _w('DONE: %d task was completed', 'DONE: %d tasks were completed', $count);
                break;
        }

        try {
            $m = new waMailMessage($subject, $body);
            $m->setTo($email);
            $m->send();
        } catch (Exception $e) {
            waLog::log('Unable to send Tasks bulk notification: ' . $e->getMessage());
        }
    }

    protected static function formatText($text)
    {
        $root_url = wa()->getRootUrl(true);
        $backend_url = wa()->getConfig()->getBackendUrl();
        $app_url = "{$root_url}{$backend_url}/tasks";

        return tasksTask::formatText($text, [
            'wrap_tags_in_links' => [
                'url_pattern' => $app_url . '/#/tasks/tag/{$tag}/',
            ],
            'wrap_task_numbers_in_links' => [
                'url_pattern' => $app_url . '/#/task/{$number}/',
            ],
        ]);
    }

    public static function send($event, $task, $log, waContact $to, array $templateData = []): void
    {
        $email = $to->get('email', 'default');
        if (!$email) {
            return;
        }

        $template_path = wa()->getAppPath('templates/mail/' . ucfirst($event) . '.html', 'tasks');
        if (!file_exists($template_path)) {
            return;
        }

        $task = self::getTask($task, $to->getId());
        if (!$task) {
            return;
        }

        $log_attachments = $task->getLogAttachments($log['id']);
        $log['images'] = $log_attachments['images'];
        $log['files'] = $log_attachments['files'];
        $log['assigned_contact'] = new waContact($log['assigned_contact_id']);
        if (!$log['assigned_contact']->exists()) {
            $log['assigned_contact'] = null;
        }

        $task['text_formatted'] = self::formatText($task['text']);
        $log['text_formatted'] = self::formatText($log['text']);

        $all_tags = $task->getTags();
        $inline_tags = tasksTask::extractTags($task['text']);
        $inline_tags = array_fill_keys($inline_tags, true);
        $side_tags = [];
        foreach ($all_tags as $tag_id => $tag_name) {
            if (!isset($inline_tags[$tag_name])) {
                $side_tags[$tag_id] = $tag_name;
            }
        }

        $body = self::renderTemplate(
            $template_path,
            array_merge(
                $templateData,
                [
                    'app_backend_url' => sprintf(
                        '%s%s/tasks/',
                        wa()->getRootUrl(true),
                        wa()->getConfig()->getBackendUrl(false)
                    ),
                    'log' => $log,
                    'task' => $task,
                    'from' => wa()->getUser(),
                    'to' => $to,
                ]
            )
        );

        switch ($event) {
            case tasksNotificationsSender::EVENT_NEW:
                $subject = sprintf(_w('NEW: %s %s'), $task['project_id'] . '.' . $task['number'], $task['name']);
                break;
            case tasksNotificationsSender::EVENT_INVITE_ASSIGN:
            case tasksNotificationsSender::EVENT_ASSIGN:
                $subject = sprintf(
                    '➡️ ' . _w('ASSIGNED: %s %s'),
                    $task['project_id'] . '.' . $task['number'],
                    $task['name']
                );
                break;
            case tasksNotificationsSender::EVENT_DONE:
                $subject = sprintf('☑️ ' . _w('DONE: %s was completed'), $task['project_id'] . '.' . $task['number']);
                break;
            case tasksNotificationsSender::EVENT_COMMENT:
            case tasksNotificationsSender::EVENT_EDIT:
            default:
                $subject = sprintf('⚡ ' . _w('EDIT: %s was edited'), $task['project_id'] . '.' . $task['number']);
                break;
        }

        try {
            $m = new waMailMessage($subject, $body);
            $m->setTo($email);
            $m->send();
        } catch (Exception $e) {
            waLog::log('Unable to send Tasks notification: ' . $e->getMessage());
        }
    }

    /**
     * Get task for this contact
     *
     * @param     $task
     * @param int $contact_id For what contact get TASK
     *
     * @return null|tasksTask
     */
    protected static function getTask($task, $contact_id): ?tasksTask
    {
        $task_id = self::toTaskId($task);
        if ($task_id <= 0) {
            return null;
        }
        if (is_array($task)) {
            $obtained = self::obtainTask($task_id, $contact_id);
            if (!$obtained) {
                return null;
            }
            $task = array_merge($obtained, $task);
        } else {
            $task = self::obtainTask($task_id, $contact_id);
        }
        if (!$task) {
            return null;
        }
        $task = new tasksTask($task);

        return $task;
    }

    protected static function toTaskId($task): ?int
    {
        if (is_array($task) && isset($task['id'])) {
            return (int) $task['id'];
        }

        if (is_scalar($task)) {
            return (int) $task;
        }

        if ($task instanceof tasksTask) {
            return (int) $task->id;
        }

        return null;
    }

    /**
     * Obtain task for this contact from DB with extra fields
     * Check rights
     *
     * @param     $task_id
     * @param int $contact_id
     *
     * @return array|null
     */
    protected static function obtainTask($task_id, $contact_id): ?array
    {
        $collection = new tasksCollection('id/' . $task_id, [
            'check_rights' => false,
        ]);

        $tasks = $collection->getTasks('*,project,tags,attachments');
        $task = $tasks && isset($tasks[$task_id]) ? $tasks[$task_id] : null;

        if ($task) {
            $rights = new tasksRights();
            if ($rights->canViewTask($task, $contact_id)) {
                return $task;
            }
        }

        return null;

    }

    protected static function renderTemplate($template, $assign = []): string
    {
        $view = wa()->getView();
        $old_vars = $view->getVars();
        $view->clearAllAssign($old_vars);
        $view->assign($assign);
        $html = $view->fetch($template);
        $view->clearAllAssign();
        $view->assign($old_vars);

        return $html;
    }
}
