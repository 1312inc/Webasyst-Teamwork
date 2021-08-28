<?php

final class tasksApiTasksUpdateRequest
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $name;

    /**
     * @var string|null
     */
    private $text;

    /**
     * @var int|null
     */
    private $assignedContactId;

    /**
     * @var int|null
     */
    private $projectId;

    /**
     * @var int|null
     */
    private $milestoneId;

    /**
     * @var int|null
     */
    private $priority;

    /**
     * @var int|null
     */
    private $statusId;

    /**
     * @var int|null
     */
    private $hiddenTimestamp;

    /**
     * @var DateTimeImmutable|null
     */
    private $dueDate;

    /**
     * @var string|null
     */
    private $filesHash;
    /**
     * @var array|null
     */
    private $attachmentsToDelete;

    public function __construct(
        int $id,
        string $name,
        ?string $text,
        ?int $assigned_contact_id,
        ?int $project_id,
        ?int $milestone_id,
        ?int $priority,
        ?int $status_id,
        ?int $hidden_timestamp,
        ?DateTimeImmutable $due_date,
        ?string $files_hash,
        ?array $attachmentsToDelete
    ) {
        $this->name = $name;
        $this->text = $text;
        $this->assignedContactId = $assigned_contact_id;
        $this->projectId = $project_id;
        $this->milestoneId = $milestone_id;
        $this->priority = $priority;
        $this->statusId = $status_id;
        $this->hiddenTimestamp = $hidden_timestamp;
        $this->dueDate = $due_date;
        $this->filesHash = $files_hash;
        $this->id = $id;
        $this->attachmentsToDelete = $attachmentsToDelete;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function getAssignedContactId(): ?int
    {
        return $this->assignedContactId;
    }

    public function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function getMilestoneId(): ?int
    {
        return $this->milestoneId;
    }

    public function getPriority(): ?int
    {
        return $this->priority;
    }

    public function getStatusId(): ?int
    {
        return $this->statusId;
    }

    public function getHiddenTimestamp(): ?int
    {
        return $this->hiddenTimestamp;
    }

    public function getDueDate(): ?DateTimeImmutable
    {
        return $this->dueDate;
    }

    public function getFilesHash(): ?string
    {
        return $this->filesHash;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getAttachmentsToDelete(): ?array
    {
        return $this->attachmentsToDelete;
    }
}
