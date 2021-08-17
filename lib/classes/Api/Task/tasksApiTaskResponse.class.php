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
     * @param tasksTask $task
     */
    public function __construct(tasksTask $task)
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
