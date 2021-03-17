<?php

final class tasksApiTaskResponse implements tasksApiResponseInterface
{
    /**
     * @var tasksApiTaskDto
     */
    private $task;

    /**
     * tasksApiTaskResponse constructor.
     *
     * @param array $task
     */
    public function __construct(array $task)
    {
        $this->task = tasksApiTaskDtoFactory::create($task);
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody()
    {
        return $this->task;
    }
}
