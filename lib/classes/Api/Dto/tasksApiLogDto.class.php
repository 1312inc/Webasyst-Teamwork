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

    /**
     * @var array
     */
    private $params;

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
        array $attachments,
        array $params
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
        $this->params = $params;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getProjectId(): ?int
    {
        return $this->project_id;
    }

    public function getTaskId(): int
    {
        return $this->task_id;
    }

    public function getContact(): tasksApiContactDto
    {
        return $this->contact;
    }

    public function getText(): string
    {
        return $this->text;
    }

    public function getCreateDatetime(): string
    {
        return $this->create_datetime;
    }

    public function getBeforeStatusId(): ?int
    {
        return $this->before_status_id;
    }

    public function getAfterStatusId(): ?int
    {
        return $this->after_status_id;
    }

    public function getAction(): string
    {
        return $this->action;
    }

    public function getAssignedContact(): ?tasksApiContactDto
    {
        return $this->assigned_contact;
    }

    public function getStatusChanged(): ?bool
    {
        return $this->status_changed;
    }

    public function getAssignmentChanged(): ?bool
    {
        return $this->assignment_changed;
    }

    public function getAttachments(): array
    {
        return $this->attachments;
    }

    public function getParams(): array
    {
        return $this->params;
    }
}
