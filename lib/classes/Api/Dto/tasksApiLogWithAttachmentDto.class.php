<?php

final class tasksApiLogWithAttachmentDto extends tasksApiLogDto
{
    /**
     * @var array<tasksApiAttachmentDto>
     */
    private $attachments;

    public function __construct(
        int $id,
        ?int $project_id,
        int $task_id,
        tasksApiContactDto $contact,
        string $text,
        string $create_datetime,
        ?int $before_status_id,
        ?int $after_status_id,
        string $action,
        ?tasksApiContactDto $assigned_contact,
        bool $status_changed,
        bool $assignment_changed,
        array $attachments
    ) {
        parent::__construct(
            $id,
            $project_id,
            $task_id,
            $contact,
            $text,
            $create_datetime,
            $before_status_id,
            $after_status_id,
            $action,
            $assigned_contact,
            $status_changed,
            $assignment_changed
        );

        $this->attachments = $attachments;
    }

    public static function createFromArray(array $data): tasksApiLogDto
    {
        return new self(
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
            (bool) $data['status_changed'],
            (bool) $data['assignment_changed']
        );
    }
}
