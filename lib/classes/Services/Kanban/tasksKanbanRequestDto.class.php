<?php

final class tasksKanbanRequestDto
{
    public const ORDER_PRIORITY = 'priority';
    public const ORDER_NEWEST = 'newest';
    public const ORDER_OLDEST = 'oldest';
    public const ORDER_DUE = 'due';

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
     * @var bool
     */
    private $withUnassigned;

    /**
     * @var string
     */
    private $order;

    /**
     * tasksKanbanRequestDto constructor.
     *
     * @param array       $filters
     * @param array       $status
     * @param array       $filterTypes
     * @param bool        $withUnassigned
     * @param int         $offset
     * @param int         $limit
     * @param string $order
     */
    public function __construct(
        array $filters,
        array $status,
        array $filterTypes,
        $withUnassigned,
        $offset,
        $limit,
        $order = self::ORDER_PRIORITY
    ) {
        $this->status = $status;
        $this->filterTypes = $filterTypes;
        $this->offset = $offset;
        $this->limit = $limit;
        $this->filters = $filters;
        $this->withUnassigned = $withUnassigned;
        $this->order = $order;
    }

    public function getStatus(): array
    {
        return $this->status;
    }

    public function getFilterTypes(): array
    {
        return $this->filterTypes;
    }

    public function getOffset(): int
    {
        return $this->offset;
    }

    public function getLimit(): int
    {
        return $this->limit;
    }

    public function getFilters(): array
    {
        return array_filter($this->filters, wa_lambda('$a', 'return !is_null($a);'));
    }

    public function isWithUnassigned(): bool
    {
        return $this->withUnassigned;
    }

    public function getOrder(): string
    {
        return $this->order;
    }
}
