<?php

final class tasksApiTaskGetListResponse
{
    /**
     * @var array<tasksApiTaskDto>
     */
    private $tasks;

    private $total = 0;

    /**
     * tasksApiTaskGetListResponse constructor.
     *
     * @param array $tasks
     * @param int   $total
     */
    public function __construct(array $tasks, int $total)
    {
        foreach ($tasks as $task) {

        }
        $this->tasks;
        $this->total = $total;
    }
}
