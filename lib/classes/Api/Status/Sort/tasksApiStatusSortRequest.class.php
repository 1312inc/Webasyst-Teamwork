<?php

final class tasksApiStatusSortRequest
{
    /**
     * @var array<int>
     */
    private $sortedIds;

    public function __construct(array $sortedIds)
    {
        $this->sortedIds = $sortedIds;
    }

    public function getSortedIds(): array
    {
        return $this->sortedIds;
    }
}
