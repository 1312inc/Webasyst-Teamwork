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
    private $assigned_contact_id;

    /**
     * @var int|null
     */
    private $project_id;

    /**
     * @var int|null
     */
    private $milestone_id;

    /**
     * @var int|null
     */
    private $priority;

    /**
     * @var int|null
     */
    private $status_id;

    /**
     * @var int|null
     */
    private $hidden_timestamp;

    /**
     * @var DateTimeImmutable|null
     */
    private $due_date;

    /**
     * @var string|null
     */
    private $files_hash;

    /**
     * tasksApiTasksAddRequest constructor.
     *
     * @param int                    $id
     * @param string                 $name
     * @param string|null            $text
     * @param int|null               $assigned_contact_id
     * @param int|null               $project_id
     * @param int|null               $milestone_id
     * @param int|null               $priority
     * @param int|null               $status_id
     * @param int|null               $hidden_timestamp
     * @param DateTimeImmutable|null $due_date
     * @param string|null            $files_hash
     */
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
        ?string $files_hash
    ) {
        $this->name = $name;
        $this->text = $text;
        $this->assigned_contact_id = $assigned_contact_id;
        $this->project_id = $project_id;
        $this->milestone_id = $milestone_id;
        $this->priority = $priority;
        $this->status_id = $status_id;
        $this->hidden_timestamp = $hidden_timestamp;
        $this->due_date = $due_date;
        $this->files_hash = $files_hash;
        $this->id = $id;
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
        return $this->assigned_contact_id;
    }

    public function getProjectId(): ?int
    {
        return $this->project_id;
    }

    public function getMilestoneId(): ?int
    {
        return $this->milestone_id;
    }

    public function getPriority(): ?int
    {
        return $this->priority;
    }

    public function getStatusId(): ?int
    {
        return $this->status_id;
    }

    public function getHiddenTimestamp(): ?int
    {
        return $this->hidden_timestamp;
    }

    public function getDueDate(): ?DateTimeImmutable
    {
        return $this->due_date;
    }

    public function getFilesHash(): ?string
    {
        return $this->files_hash;
    }

    public function getId(): int
    {
        return $this->id;
    }
}
