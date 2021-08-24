<?php

final class tasksApiCountsDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var int
     */
    private $total;

    /**
     * @var int
     */
    private $closed;

    /**
     * @var int
     */
    private $active;

    /**
     * @var int
     */
    private $active_priority;

    /**
     * @param int $closed
     * @param int $active_priority
     * @param int $active
     * @param int $total
     */
    public function __construct(int $closed, int $active_priority, int $active, int $total)
    {
        $this->active_priority = $active_priority;
        $this->active = $active;
        $this->closed = $closed;
        $this->total = $total;
    }

    public function getClosed(): int
    {
        return $this->closed;
    }

    public function getActive(): int
    {
        return $this->active;
    }

    public function getActivePriority(): int
    {
        return $this->active_priority;
    }

    public function getTotal(): int
    {
        return $this->total;
    }
}
