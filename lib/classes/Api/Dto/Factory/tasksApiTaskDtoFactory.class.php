<?php

final class tasksApiTaskDtoFactory
{
    /**
     * @var tasksApiTaskDto[]
     */
    private static $tasks;

    public static function create(array $data): tasksApiTaskDto
    {
        $id = (int) $data['id'];
        if (!isset(self::$tasks[$id])) {
            self::$tasks[$id] = new tasksApiTaskDto(
                (int) $data['id'],
                $data['name'],
                $data['text'],
                tasksApiContactDtoFactory::fromContactId($data['create_contact_id']),
                $data['create_datetime'],
                $data['update_datetime'] ?? null,
                tasksApiContactDtoFactory::fromContactId($data['assigned_contact_id']),
                (int) $data['project_id'],
                !empty($data['milestone_id']) ? (int) $data['milestone_id'] : null,
                (int) $data['number'],
                (int) $data['status_id'],
                !empty($data['parent_id']) ? (int) $data['parent_id'] : null,
                (int) $data['priority'],
                !empty($data['assign_log_id']) ? (int) $data['assign_log_id'] : null,
                !empty($data['comment_log_id']) ? (int) $data['comment_log_id'] : null,
                (int) $data['contact_id'],
                (int) $data['hidden_timestamp'],
                !empty($data['due_date']) ? (string) $data['due_date'] : null,
                array_values(self::createAttachments($data)),
                array_values(self::createLogs($data)),
                array_values(self::createTags($data)),
                !empty($data['project']) ? tasksApiProjectDtoFactory::create($data['project']) : null
            );
        }

        return self::$tasks[$id];
    }

    /**
     * @return array<tasksApiAttachmentDto>
     */
    private static function createAttachments(array $data): array
    {
        $allAttachments = [];
        if (isset($data['all_attachments']) && is_array($data['all_attachments'])) {
            foreach ($data['all_attachments'] as $attachment) {
                $allAttachments[(int) $attachment['id']] = new tasksApiAttachmentDto(
                    (int) $attachment['id'],
                    !empty($attachment['log_id']) ? (int) $attachment['log_id'] : null,
                    (string) $attachment['create_datetime'],
                    tasksApiContactDtoFactory::fromContactId($attachment['contact_id']),
                    $attachment['name'],
                    (int) $attachment['size'],
                    $attachment['ext'],
                    $attachment['code']
                );
            }
        }

        return $allAttachments;
    }

    /**
     * @return array<tasksApiLogDto>
     */
    private static function createLogs(array $data): array
    {
        $logs = [];
        if (isset($data['log']) && is_array($data['log'])) {
            foreach ($data['log'] as $log) {
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
                    tasksApiContactDtoFactory::fromContactId($log['assigned_contact_id']),

                    (bool) $log['status_changed'],
                    (bool) $log['assignment_changed']
                );
            }
        }

        return $logs;
    }

    /**
     * @return array<tasksApiTagDto>
     */
    private static function createTags(array $data): array
    {
        $tags = [];
        if (isset($data['full_tags']) && is_array($data['full_tags'])) {
            foreach ($data['full_tags'] as $tag) {
                $tags[(int) $tag['id']] = tasksApiTagDtoFactory::create($tag);
            }
        }

        return $tags;
    }
}
