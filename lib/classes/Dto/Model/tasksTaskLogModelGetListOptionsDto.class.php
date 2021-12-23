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
            !empty($data['for_contact'])
                ? ($data['for_contact'] instanceOf waContact ? $data['for_contact'] : new waContact($data['for_contact']))
                : null
        );
    }
}
