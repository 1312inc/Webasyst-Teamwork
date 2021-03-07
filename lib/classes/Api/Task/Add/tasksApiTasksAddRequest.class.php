<?php

final class tasksApiTasksAddRequest
{
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
     * tasksApiTasksAddRequest constructor.
     *
     * @param string                 $name
     * @param string|null            $text
     * @param int|null               $assigned_contact_id
     * @param int|null               $project_id
     * @param int|null               $milestone_id
     * @param int|null               $priority
     * @param int|null               $status_id
     * @param int|null               $hidden_timestamp
     * @param DateTimeImmutable|null $due_date
     */
    public function __construct(
        string $name,
        ?string $text,
        ?int $assigned_contact_id,
        ?int $project_id,
        ?int $milestone_id,
        ?int $priority,
        ?int $status_id,
        ?int $hidden_timestamp,
        ?DateTimeImmutable $due_date
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
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @return string|null
     */
    public function getText(): ?string
    {
        return $this->text;
    }

    /**
     * @return int|null
     */
    public function getAssignedContactId(): ?int
    {
        return $this->assigned_contact_id;
    }

    /**
     * @return int|null
     */
    public function getProjectId(): ?int
    {
        return $this->project_id;
    }

    /**
     * @return int|null
     */
    public function getMilestoneId(): ?int
    {
        return $this->milestone_id;
    }

    /**
     * @return int|null
     */
    public function getPriority(): ?int
    {
        return $this->priority;
    }

    /**
     * @return int|null
     */
    public function getStatusId(): ?int
    {
        return $this->status_id;
    }

    /**
     * @return int|null
     */
    public function getHiddenTimestamp(): ?int
    {
        return $this->hidden_timestamp;
    }

    /**
     * @return DateTimeImmutable|null
     */
    public function getDueDate(): ?DateTimeImmutable
    {
        return $this->due_date;
    }
}
