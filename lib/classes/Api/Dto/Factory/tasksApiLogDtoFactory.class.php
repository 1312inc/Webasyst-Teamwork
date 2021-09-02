<?php

class tasksApiLogDtoFactory
{
    public static function createFromArray(array $data): tasksApiLogDto
    {
        return new tasksApiLogDto(
            (int) $data['id'],
            isset($data['project_id']) ? (int) $data['project_id'] : null,
            (int) $data['task_id'],
            tasksApiContactDtoFactory::fromContactId((int) $data['contact_id']),
            (string) $data['text'],
            (string) $data['create_datetime'],
            isset($data['before_status_id']) ? (int) $data['before_status_id'] : null,
            isset($data['after_status_id']) ? (int) $data['after_status_id'] : null,
            (string) $data['action'],
            !empty($data['assigned_contact_id'])
                ? tasksApiContactDtoFactory::fromContactId((int) $data['assigned_contact_id'])
                : null,
            isset($data['status_changed']) && $data['status_changed'],
            isset($data['assignment_changed']) && $data['assignment_changed'],
            $data['attachments'] ?? []
        );
    }

    public static function createFromArrayWithAttachmentsFetch(array $data): tasksApiLogDto
    {
        $attachments = tsks()->getModel(tasksAttachment::class)->getByLogId($data['id']);
        $attachmentDtos = [];
        foreach ($attachments as $attachment) {
            $attachmentDtos[] = tasksApiAttachmentDtoFactory::createFromArray($attachment);
        }

        return new tasksApiLogDto(
            (int) $data['id'],
            isset($data['project_id']) ? (int) $data['project_id'] : null,
            (int) $data['task_id'],
            tasksApiContactDtoFactory::fromContactId((int) $data['contact_id']),
            (string) $data['text'],
            (string) $data['create_datetime'],
            isset($data['before_status_id']) ? (int) $data['before_status_id'] : null,
            isset($data['after_status_id']) ? (int) $data['after_status_id'] : null,
            (string) $data['action'],
            !empty($data['assigned_contact_id'])
                ? tasksApiContactDtoFactory::fromContactId((int) $data['assigned_contact_id'])
                : null,
            isset($data['status_changed']) ? (bool) $data['status_changed'] : null,
            isset($data['assignment_changed']) ? (bool) $data['assignment_changed'] : null,
            $attachmentDtos
        );
    }
}
