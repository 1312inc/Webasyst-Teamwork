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

    public function __construct(?int $closed, ?int $active_priority, ?int $active, ?int $total)
    {
        $this->active_priority = (int) $active_priority;
        $this->active = (int) $active;
        $this->closed = (int) $closed;
        $this->total = (int) $total;
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
