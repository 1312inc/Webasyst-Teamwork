<?php

class tasksApiAttachmentDtoFactory
{
    public static function createFromArray(array $data): tasksApiAttachmentDto
    {
        $isImage = self::isImageAttachment($data);

        return new tasksApiAttachmentDto(
            (int) $data['id'],
            !empty($data['log_id']) ? (int) $data['log_id'] : null,
            DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $data['create_datetime'])
                ->setTimezone(new DateTimeZone('UTC'))
                ->format('Y-m-d\TH:i:sP'),
            tasksApiContactDtoFactory::fromContactId($data['contact_id']),
            $data['name'],
            (int) $data['size'],
            $data['ext'],
            $data['code'],
            sprintf(
                '%sapi.php/tasks.attachments.download?id=%d',
                wa()->getRootUrl(true),
                $data['id']
            ),
            $isImage,
            $isImage ? tasksHelper::getAttachPreviewUrl($data, true) : null
        );
    }

    private static function isImageAttachment($attachment): bool
    {
        return tasksTask::isImageAttachment($attachment);
    }
}
