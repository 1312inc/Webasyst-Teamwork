<?php

final class tasksKanbanRequestDto
{
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
     * @var array
     */
    private $filters;

    /**
     * tasksKanbanRequestDto constructor.
     *
     * @param array $filters
     * @param array $status
     * @param array $filterTypes
     * @param int   $offset
     * @param int   $limit
     */
    public function __construct(
        array $filters,
        array $status,
        array $filterTypes,
        $offset,
        $limit
    ) {
        $this->status = $status;
        $this->filterTypes = $filterTypes;
        $this->offset = $offset;
        $this->limit = $limit;
        $this->filters = $filters;
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

    /**
     * @return array
     */
    public function getFilters(): array
    {
        return array_filter($this->filters, wa_lambda('$a', 'return !is_null($a);'));
    }
}
