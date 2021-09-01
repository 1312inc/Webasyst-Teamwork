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
            $visavisContact = null;
            if ($task->assigned_contact_id == wa()->getUser()->getId()) {
                $visavisContact = $task->getAssignmentCreator();
            } elseif ($task->assigned_contact_id) {
                $visavisContact = $task->getAssignedContact();
            }

            self::$tasks[$task->id] = new tasksApiTaskDto(
                (int) $task->id,
                $task['name'],
                $task['text'],
                tasksApiContactDtoFactory::fromContactId($task['create_contact_id']),
                $visavisContact ? tasksApiContactDtoFactory::fromContact($visavisContact) : null,
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
                !empty($task['project']) ? tasksApiProjectDtoFactory::createFromArray($task['project']) : null
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
            $allAttachments[(int) $attachment['id']] = tasksApiAttachmentDtoFactory::createFromArray($attachment);
        }

        foreach ($task->getImages() as $attachment) {
            $allAttachments[(int) $attachment['id']] = tasksApiAttachmentDtoFactory::createFromArray($attachment);
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
            $logs[(int) $log['id']] = tasksApiLogDtoFactory::createFromArray($log);
        }

        return $logs;
    }

    /**
     * @return array<tasksApiTagDto>
     */
    private static function createTags(tasksTask $task): array
    {
        $tags = [];
        foreach ($task->getTags() as $id => $tag) {
            $tags[] = tasksApiTagDtoFactory::create(['id' => $id, 'name' => $tag, 'favorite' => null]);
        }

        return $tags;
    }
}
