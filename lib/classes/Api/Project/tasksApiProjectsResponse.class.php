<?php

final class tasksApiProjectsResponse implements tasksApiResponseInterface
{
    /**
     * @var array<tasksApiProjectVo>
     */
    private $projects = [];

    /**
     * tasksApiProjectsResponse constructor.
     *
     * @param array<tasksProject> $projects
     */
    public function __construct(array $projects)
    {
        foreach ($projects as $project) {
            $this->projects[] = tasksApiProjectVo::fromEntity($project);
        }
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody(): array
    {
        return $this->projects;
    }
}
