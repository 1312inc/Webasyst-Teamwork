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
    private $priority;

    /**
     * @param int $priority_count
     * @param int $total
     */
    public function __construct(int $priority_count, int $total)
    {
        $this->priority = $priority_count;
        $this->total = $total;
    }

    public function getTotal(): int
    {
        return $this->total;
    }

    public function getPriority(): int
    {
        return $this->priority;
    }
}
