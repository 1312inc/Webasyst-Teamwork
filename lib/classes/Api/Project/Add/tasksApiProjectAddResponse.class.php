<?php

final class tasksApiProjectAddResponse implements tasksApiResponseInterface
{
    /**
     * @var tasksApiProjectVo
     */
    private $project;

    /**
     * tasksApiProjectAddResponse constructor.
     *
     * @param tasksProject $project
     */
    public function __construct(tasksProject $project)
    {
        $this->project = tasksApiProjectVo::fromEntity($project);
    }

    public function getStatus(): int
    {
        return 200;
    }

    public function getResponseBody(): tasksApiProjectVo
    {
        return $this->project;
    }
}
