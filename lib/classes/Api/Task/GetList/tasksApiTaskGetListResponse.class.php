<?php

final class tasksApiTaskGetListResponse
{
    /**
     * @var array<tasksApiTaskDto>
     */
    private $tasks;

    private $total = 0;

    public function __construct(array $tasks, int $total)
    {
        $this->tasks;
        $this->total = $total;
    }
}
