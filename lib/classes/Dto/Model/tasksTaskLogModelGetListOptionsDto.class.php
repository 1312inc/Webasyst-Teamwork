<?php

class tasksTaskLogModelGetListOptionsDto
{
    /**
     * @var int
     */
    private $limit;

    /**
     * @var null|int
     */
    private $start;

    /**
     * @var null|int
     */
    private $milestoneId;

    /**
     * @var null|int
     */
    private $contactId;

    /**
     * @var null|waContact
     */
    private $forContact;

    /**
     * @var null|int
     */
    private $projectId;

    /**
     * @var null|int
     */
    private $taskId;

    /**
     * @var bool
     */
    private $withTasks = false;

    /**
     * @var null|string
     */
    private $groupBy;

    /**
     * @var null|string
     */
    private $startDate;

    /**
     * @var null|string
     */
    private $endDate;

    /**
     * @var null|string
     */
    private $action;

    public function __construct(
        ?int $limit,
        ?int $start,
        ?int $milestoneId,
        ?int $contactId,
        ?int $projectId,
        bool $withTasks,
        ?string $groupBy,
        ?string $startDate,
        ?string $endDate,
        ?string $action,
        ?int $taskId,
        ?waContact $forContact
    ) {
        $this->limit = $limit ?? tasksOptions::getLogsPerPage();
        $this->start = $start ?? 0;
        $this->milestoneId = $milestoneId;
        $this->contactId = $contactId;
        $this->projectId = $projectId;
        $this->withTasks = $withTasks;
        $this->groupBy = $groupBy;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->action = $action;
        $this->taskId = $taskId;
        $this->forContact = $forContact;
    }

    public function getStartDate(): ?string
    {
        return $this->startDate;
    }

    public function getEndDate(): ?string
    {
        return $this->endDate;
    }

    public function getGroupBy(): ?string
    {
        return $this->groupBy;
    }

    public function isWithTasks(): bool
    {
        return $this->withTasks;
    }

    public function getLimit(): int
    {
        return $this->limit;
    }

    public function getStart(): ?int
    {
        return $this->start;
    }

    public function getMilestoneId(): ?int
    {
        return $this->milestoneId;
    }

    public function getContactId(): ?int
    {
        return $this->contactId;
    }

    public function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function getForContact(): ?waContact
    {
        return $this->forContact;
    }

    public function getTaskId(): ?int
    {
        return $this->taskId;
    }

    public function getAction(): ?string
    {
        return $this->action;
    }

    public static function fromArray(array $data): self
    {
        return new self(
            $data['limit'] ?? 0,
            $data['start'] ?? 0,
            $data['milestone_id'] ?? 0,
            $data['contact_id'] ?? 0,
            $data['project_id'] ?? 0,
            filter_var($data['with_tasks'] ?? false, FILTER_VALIDATE_BOOLEAN),
            $data['group_by'] ?? null,
            $data['start_date'] ?? null,
            $data['end_date'] ?? null,
            $data['action'] ?? null,
            $data['task_id'] ?? null,
            !empty($data['for_contact'])
                ? ($data['for_contact'] instanceOf waContact ? $data['for_contact'] : new waContact($data['for_contact']))
                : null
        );
    }
}
