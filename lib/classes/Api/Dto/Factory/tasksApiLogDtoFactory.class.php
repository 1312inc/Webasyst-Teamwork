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
            DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $data['create_datetime'])
                ->setTimezone(new DateTimeZone('UTC'))
                ->format('Y-m-d\TH:i:sP'),
            isset($data['before_status_id']) ? (int) $data['before_status_id'] : null,
            isset($data['after_status_id']) ? (int) $data['after_status_id'] : null,
            (string) $data['action'],
            !empty($data['assigned_contact_id'])
                ? tasksApiContactDtoFactory::fromContactId((int) $data['assigned_contact_id'])
                : null,
            isset($data['status_changed']) && $data['status_changed'],
            isset($data['assignment_changed']) && $data['assignment_changed'],
            $data['attachments'] ?? [],
            $data['params'] ?? [],
            $data['task']['name'] ?? null,
            $data['task']['number'] ?? null,
            tasksHelper::convertToMarkdownAndStripTags((string) $data['text'], tasksOptions::getApiTextStrippedTruncateLength())
        );
    }

    public static function createFromArrayWithAttachmentsFetch(array $data): tasksApiLogDto
    {
        $attachments = tsks()->getModel(tasksAttachment::class)->getByLogId($data['id']);
        $data['attachments'] = [];
        foreach ($attachments as $attachment) {
            $data['attachments'][] = tasksApiAttachmentDtoFactory::createFromArray($attachment);
        }

        return self::createFromArray($data);
    }
}
