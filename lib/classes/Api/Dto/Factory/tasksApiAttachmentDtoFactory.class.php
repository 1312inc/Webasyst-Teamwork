<?php

class tasksApiAttachmentDtoFactory
{
    public static function createFromArray(array $data): tasksApiAttachmentDto
    {
        $isImage = self::isImageAttachment($data);

        return new tasksApiAttachmentDto(
            (int) $data['id'],
            !empty($data['log_id']) ? (int) $data['log_id'] : null,
            (string) $data['create_datetime'],
            tasksApiContactDtoFactory::fromContactId($data['contact_id']),
            $data['name'],
            (int) $data['size'],
            $data['ext'],
            $data['code'],
            sprintf(
                '%s%s/api.php/tasks.attachments.download.method.php?id=%d',
                wa()->getRootUrl(true),
                wa()->getConfig()->getBackendUrl(),
                $data['id']
            ),
            $isImage,
            $isImage ? tasksHelper::getAttachPreviewUrl($data, true) : null
        );
    }

    private static function isImageAttachment($attachment): bool
    {
        if (is_scalar($attachment)) {
            $ext = (string) $attachment;
        } elseif (is_array($attachment) && isset($attachment['ext'])) {
            $ext = (string) $attachment['ext'];
        } else {
            $ext = '';
        }

        return in_array(strtolower($ext), ['jpg', 'png', 'gif', 'jpeg']);
    }
}
