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
        ?int $projectId,
        int $taskId,
        tasksApiContactDto $contact,
        string $text,
        string $createDatetime,
        ?int $beforeStatusId,
        ?int $afterStatusId,
        string $action,
        ?tasksApiContactDto $assignedContact,
        ?bool $statusChanged,
        ?bool $assignmentChanged,
        array $attachments
    ) {
        $this->id = $id;
        $this->project_id = $projectId;
        $this->task_id = $taskId;
        $this->contact = $contact;
        $this->text = $text;
        $this->create_datetime = $createDatetime;
        $this->before_status_id = $beforeStatusId;
        $this->after_status_id = $afterStatusId;
        $this->action = $action;
        $this->assigned_contact = $assignedContact;
        $this->status_changed = $statusChanged;
        $this->assignment_changed = $assignmentChanged;
        $this->attachments = $attachments;
    }
}
