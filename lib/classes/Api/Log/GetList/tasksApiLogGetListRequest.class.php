<?php

final class tasksApiLogGetListRequest
{
    /**
     * @var int
     */
    private $offset;

    /**
     * @var int
     */
    private $limit;

    /**
     * @var int|null
     */
    private $projectId;

    /**
     * @var int|null
     */
    private $contactId;

    /**
     * @var int|null
     */
    private $milestoneId;

    /**
     * @var null|int
     */
    private $taskId;

    /**
     * @var null|string
     */
    private $action;

    /**
     * @var null|string
     */
    private $startDate;

    /**
     * @var null|string
     */
    private $endDate;

    /**
     * tasksApiLogGetListRequest constructor.
     *
     * @param int|null $projectId
     * @param int|null $contactId
     * @param int|null $milestoneId
     * @param int      $offset
     * @param int      $limit
     *
     * @throws tasksValidateException
     */
    public function __construct(
        ?int $projectId, 
        ?int $contactId, 
        ?int $milestoneId, 
        ?int $taskId, 
        ?string $action, 
        ?string $startDate,
        ?string $endDate,
        int $offset, 
        int $limit
    )
    {
        if ($offset < 0) {
            throw new tasksValidateException('Offset must be 0 or positive');
        }

        if ($limit < 0) {
            throw new tasksValidateException('Limit must be 0 or positive');
        }

        $this->offset = $offset;
        $this->limit = $limit;
        $this->projectId = $projectId;
        $this->contactId = $contactId;
        $this->milestoneId = $milestoneId;
        $this->action = $action;
        $this->taskId = $taskId;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function getOffset(): int
    {
        return $this->offset;
    }

    public function getLimit(): int
    {
        return $this->limit;
    }

    public function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function getContactId(): ?int
    {
        return $this->contactId;
    }

    public function getMilestoneId(): ?int
    {
        return $this->milestoneId;
    }

    public function getFilters(): array
    {
        return array_filter(
            [
                'project_id' => $this->projectId, 
                'contact_id' => $this->contactId, 
                'milestone_id' => $this->milestoneId,
                'start_date' => $this->startDate,
                'end_date' => $this->endDate,
                'action' => $this->action,
                'task_id' => $this->taskId,
            ],
            static function ($f) {
                return $f !== null;
            }
        );
    }
}
