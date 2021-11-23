<?php

class tasksWaLogManager
{
    public const LOG_ADD          = 'task_add';
    public const LOG_EDIT         = 'task_edit';
    public const LOG_DELETE       = 'task_DELETE';
    public const LOG_FORWARD      = 'task_forward';
    public const LOG_RETURN       = 'task_return';
    public const LOG_ACTION       = 'task_action';
    public const LOG_COMMENT      = 'task_comment';
    public const LOG_COMMENT_EDIT = 'task_comment_edit';

    public const LOG_TYPES = [
        self::LOG_ADD,
        self::LOG_EDIT,
        self::LOG_FORWARD,
        self::LOG_RETURN,
        self::LOG_ACTION,
        self::LOG_COMMENT,
    ];

    public function lodAdd(tasksTask2 $task2): void
    {
        $this->logAction(self::LOG_ADD, $task2->getId());
    }

    public function lodEdit(tasksTask2 $task2, int $logItemId): void
    {
        $this->logAction(self::LOG_EDIT, $task2->getId() . ':' . $logItemId);
    }

    public function logDelete(int $count): void
    {
        $this->logAction(self::LOG_DELETE, $count);
    }

    /**
     * @param string   $action
     * @param mixed    $params
     * @param int|null $subject_contact_id
     * @param int|null $contact_id - actor contact id
     *
     * @return bool|int
     * @see \waController::logAction
     * Add record to table wa_log
     */
    public function logAction(
        string $action,
        $params = null,
        int $subject_contact_id = null,
        int $contact_id = null
    ) {
        try {
            if (!class_exists('waLogModel')) {
                wa('webasyst');
            }

            return tsks()->getModel('waLog')->add($action, $params, $subject_contact_id, $contact_id);
        } catch (Throwable $ex) {
            waLog::log($ex->getMessage(), 'tasks2.log');
        }

        return false;
    }

    public function explainLogs(array $logs, bool $isAdmin, array $rightsCollect): array
    {
        $taskIds = [];

        foreach ($logs as $l_id => $l) {
            if (in_array($l['action'], self::LOG_TYPES, true) && $l['params']) {
                $t = explode(':', $l['params'], 3);
                $taskIds[$t[0]] = $t[0];
            }
        }

        $tasks = [];
        if ($taskIds) {
            $task_model = new tasksTaskModel();
            $admin_tasks = [];
            $assign_tasks = [];

            if ($isAdmin) {
                $admin_tasks = $task_model->getById(array_keys($taskIds));
            } elseif (!empty($rightsCollect['admin'])) {
                $admin_tasks = $task_model->getByField(
                    [
                        'id' => array_keys($taskIds),
                        'project_id' => $rightsCollect['admin'],
                    ],
                    'id'
                );
            }

            if (!empty($rightsCollect['assign'])) {
                //Return tasks assigned for active user
                $assign_tasks = $task_model->getByField(
                    [
                        'id' => array_keys($taskIds),
                        'assigned_contact_id' => wa()->getUser()->getId(),
                        'project_id' => $rightsCollect['assign'],
                    ],
                    'id'
                );
            }

            $tasks = $assign_tasks + $admin_tasks;

            //Clear not assigned task from log
            foreach ($logs as $l_id => $l) {
                if ($l['params']) {
                    $t = explode(':', $l['params'], 3);
                    if (empty($tasks[$t[0]])) {
                        $logs[$l_id] = [];
                    }
                }
            }
        }

        foreach ($logs as $l_id => $l) {
            //If log cleared, not need replace values
            if (empty($l)) {
                continue;
            }

            $t = null;
            $logs[$l_id]['params_html'] = '';

            $paramsExploded = explode(':', $l['params'], 3);

            if (in_array($l['action'], self::LOG_TYPES, true) && $l['params']) {
                $t = $tasks[$paramsExploded[0]] ?? null;
            } elseif ($l['action'] === self::LOG_DELETE) {
                if ($l['params'] > 1) {
                    $logs[$l_id]['params_html'] = '(' . _w('%d task', '%d tasks', $l['params']) . ')';
                }

                continue;
            }

            if ($t) {
                //If name not found, need set dummy
                if (empty($t['name'])) {
                    $t['name'] = _wd('tasks', "(no name)");
                }

                $url = sprintf(
                    '%stasks/#/task/%d.%d/',
                    wa()->getConfig()->getBackendUrl(true),
                    $t['project_id'],
                    $t['number']
                );

                $logs[$l_id]['params_html'] .= sprintf(
                    '<div class="activity-target"><a href="%s">%s</a></div>',
                    $url,
                    htmlspecialchars($t['name'])
                );

                switch ($l['action']) {
                    case self::LOG_FORWARD:
                    case self::LOG_RETURN:
                    case self::LOG_ACTION:
                        $actionParams = [];
                        if (isset($paramsExploded[2])) {
                            $actionParams = json_decode($paramsExploded[2], true);
                        }

                        if (!empty($actionParams['action_text'])) {
                            $comment = tasksHelper::convertToMarkdownAndStripTags($actionParams['action_text'], 512);
                            $logs[$l_id]['params_html'] .= '<br>' . $comment;
                        }
                        break;

                    case self::LOG_COMMENT:
                        $commentParams = [];
                        if (isset($paramsExploded[2])) {
                            $commentParams = json_decode($paramsExploded[2], true);
                        }

                        if (!empty($commentParams['comment_text'])) {
                            $comment = tasksHelper::convertToMarkdownAndStripTags($commentParams['comment_text'], 512);
                            $logs[$l_id]['params_html'] .= '<br>' . $comment;
                        }
                        break;
                }
            }
        }

        return $logs;
    }
}