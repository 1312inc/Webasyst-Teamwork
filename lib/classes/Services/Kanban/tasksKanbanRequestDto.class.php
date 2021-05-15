<?php

final class tasksKanbanRequestDto
{
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
     * @var array
     */
    private $status;

    /**
     * @var array
     */
    private $filterTypes;

    /**
     * @var int
     */
    private $offset;

    /**
     * @var int
     */
    private $limit;

    /**
     * tasksKanbanRequestDto constructor.
     *
     * @param int|null $projectId
     * @param int|null $contactId
     * @param int|null $milestoneId
     * @param array    $status
     * @param array    $filterTypes
     * @param int      $offset
     * @param int      $limit
     */
    public function __construct(
        $projectId,
        $contactId,
        $milestoneId,
        array $status,
        array $filterTypes,
        $offset,
        $limit
    ) {
        $this->projectId = $projectId;
        $this->contactId = $contactId;
        $this->milestoneId = $milestoneId;
        $this->status = $status;
        $this->filterTypes = $filterTypes;
        $this->offset = $offset;
        $this->limit = $limit;
    }

    /**
     * @return int|null
     */
    public function getProjectId(): ?int
    {
        return $this->projectId;
    }

    /**
     * @return int|null
     */
    public function getContactId(): ?int
    {
        return $this->contactId;
    }

    /**
     * @return int|null
     */
    public function getMilestoneId(): ?int
    {
        return $this->milestoneId;
    }

    /**
     * @return array
     */
    public function getStatus(): array
    {
        return $this->status;
    }

    /**
     * @return array
     */
    public function getFilterTypes(): array
    {
        return $this->filterTypes;
    }

    /**
     * @return int
     */
    public function getOffset(): int
    {
        return $this->offset;
    }

    /**
     * @return int
     */
    public function getLimit(): int
    {
        return $this->limit;
    }
}
