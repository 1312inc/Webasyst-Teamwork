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
            isset($data['assignment_changed']) && $data['assignment_changed']
        );
    }

    public static function createFromArrayWithAttachments(array $data): tasksApiLogWithAttachmentDto
    {
        $attachments = tsks()->getModel(tasksAttachment::class)->getByLogId($data['id']);
        $attachmentDtos = [];
        foreach ($attachments as $attachment) {
            $attachmentDtos[] = tasksApiAttachmentDtoFactory::createFromArray($attachment);
        }

        return new tasksApiLogWithAttachmentDto(
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
            $attachmentDtos
        );
    }
}
