<?php

final class tasksApiProjectResponse implements tasksApiResponseInterface
{
    /**
     * @var tasksApiProjectDto
     */
    private $project;

    /**
     * tasksApiProjectResponse constructor.
     *
     * @param tasksProject $project
     */
    public function __construct(tasksProject $project)
    {
        $this->project = tasksApiProjectDto::fromEntity($project);
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody(): tasksApiProjectDto
    {
        return $this->project;
    }
}
