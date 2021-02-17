<?php

final class tasksApiProjectResponse implements tasksApiResponseInterface
{
    /**
     * @var tasksApiProjectVo
     */
    private $project;

    /**
     * tasksApiProjectResponse constructor.
     *
     * @param tasksProject $project
     */
    public function __construct(tasksProject $project)
    {
        $this->project = tasksApiProjectVo::fromEntity($project);
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody(): tasksApiProjectVo
    {
        return $this->project;
    }
}
