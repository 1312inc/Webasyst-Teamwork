<?php

final class tasksApiTaskDtoFactory
{
    /**
     * @var tasksApiTaskDto[]
     */
    private static $tasks;

    public static function create(tasksTask $task): tasksApiTaskDto
    {
        if (!isset(self::$tasks[$task->id])) {
            self::$tasks[$task->id] = new tasksApiTaskDto(
                (int) $task->id,
                $task['name'],
                $task['text'],
                tasksApiContactDtoFactory::fromContactId($task['create_contact_id']),
                $task['create_datetime'],
                $task['update_datetime'] ?? null,
                !empty($task['assigned_contact_id'])
                    ? tasksApiContactDtoFactory::fromContactId($task['assigned_contact_id'])
                    : null,
                (int) $task['project_id'],
                !empty($task['milestone_id']) ? (int) $task['milestone_id'] : null,
                (int) $task['number'],
                (int) $task['status_id'],
                !empty($task['parent_id']) ? (int) $task['parent_id'] : null,
                (int) $task['priority'],
                !empty($task['assign_log_id']) ? (int) $task['assign_log_id'] : null,
                !empty($task['comment_log_id']) ? (int) $task['comment_log_id'] : null,
                (int) $task['contact_id'],
                (int) $task['hidden_timestamp'],
                !empty($task['due_date']) ? (string) $task['due_date'] : null,
                array_values(self::createAttachments($task)),
                array_values(self::createLogs($task)),
                array_values(self::createTags($task)),
                !empty($task['project']) ? tasksApiProjectDtoFactory::create($task['project']) : null
            );
        }

        return self::$tasks[$task->id];
    }

    /**
     * @return array<tasksApiAttachmentDto>
     */
    private static function createAttachments(tasksTask $task): array
    {
        $allAttachments = [];
        foreach ($task->getFiles() as $attachment) {
            $allAttachments[(int) $attachment['id']] = new tasksApiAttachmentDto(
                (int) $attachment['id'],
                !empty($attachment['log_id']) ? (int) $attachment['log_id'] : null,
                (string) $attachment['create_datetime'],
                tasksApiContactDtoFactory::fromContactId($attachment['contact_id']),
                $attachment['name'],
                (int) $attachment['size'],
                $attachment['ext'],
                $attachment['code'],
                sprintf(
                    '%s%s/%s?module=attachments&action=download&id=%d',
                    wa()->getRootUrl(true),
                    wa()->getConfig()->getBackendUrl(),
                    tasksConfig::APP_ID,
                    $attachment['id']
                ),
                false,
                null
            );
        }

        foreach ($task->getImages() as $attachment) {
            $allAttachments[(int) $attachment['id']] = new tasksApiAttachmentDto(
                (int) $attachment['id'],
                !empty($attachment['log_id']) ? (int) $attachment['log_id'] : null,
                (string) $attachment['create_datetime'],
                tasksApiContactDtoFactory::fromContactId($attachment['contact_id']),
                $attachment['name'],
                (int) $attachment['size'],
                $attachment['ext'],
                $attachment['code'],
                sprintf(
                    '%s%s/%s?module=attachments&action=download&id=%d',
                    wa()->getRootUrl(true),
                    wa()->getConfig()->getBackendUrl(),
                    tasksConfig::APP_ID,
                    $attachment['id']
                ),
                true,
                tasksHelper::getAttachPreviewUrl($attachment, true)
            );
        }

        return $allAttachments;
    }

    /**
     * @return array<tasksApiLogDto>
     */
    private static function createLogs(tasksTask $task): array
    {
        $logs = [];
        foreach ($task->getLog() as $log) {
            $logs[(int) $log['id']] = new tasksApiLogDto(
                (int) $log['id'],
                isset($log['project_id']) ? (int) $log['project_id'] : null,
                (int) $log['task_id'],
                tasksApiContactDtoFactory::fromContactId($log['contact_id']),
                $log['text'],
                (string) $log['create_datetime'],
                isset($log['before_status_id']) ? (int) $log['before_status_id'] : null,
                isset($log['after_status_id']) ? (int) $log['after_status_id'] : null,
                (string) $log['action'],
                !empty($log['assigned_contact_id'])
                    ? tasksApiContactDtoFactory::fromContactId($log['assigned_contact_id'])
                    : null,
                (bool) $log['status_changed'],
                (bool) $log['assignment_changed']
            );
        }

        return $logs;
    }

    /**
     * @return array<tasksApiTagDto>
     */
    private static function createTags(tasksTask $task): array
    {
        $tags = [];
        foreach ($task->getTags() as $tag) {
            $tags[(int) $tag['id']] = tasksApiTagDtoFactory::create($tag);
        }

        return $tags;
    }
}
