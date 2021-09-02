<?php

class tasksApiLogDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var int
     */
    private $id;

    /**
     * @var ?int
     */
    private $project_id;

    /**
     * @var int
     */
    private $task_id;

    /**
     * @var tasksApiContactDto
     */
    private $contact;

    /**
     * @var string
     */
    private $text;

    /**
     * @var string
     */
    private $create_datetime;

    /**
     * @var int|null
     */
    private $before_status_id;

    /**
     * @var int|null
     */
    private $after_status_id;

    /**
     * @var string
     */
    private $action;

    /**
     * @var tasksApiContactDto|null
     */
    private $assigned_contact;

    /**
     * @var bool|null
     */
    private $status_changed;

    /**
     * @var bool|null
     */
    private $assignment_changed;

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
        ?bool $status_changed,
        ?bool $assignment_changed,
        array $attachments
    ) {
        $this->id = $id;
        $this->project_id = $project_id;
        $this->task_id = $task_id;
        $this->contact = $contact;
        $this->text = $text;
        $this->create_datetime = $create_datetime;
        $this->before_status_id = $before_status_id;
        $this->after_status_id = $after_status_id;
        $this->action = $action;
        $this->assigned_contact = $assigned_contact;
        $this->status_changed = $status_changed;
        $this->assignment_changed = $assignment_changed;
        $this->attachments = $attachments;
    }
}
