<?php

final class tasksApiProjectGetListResponse implements tasksApiResponseInterface
{
    /**
     * @var array<tasksApiProjectVo>
     */
    private $projects = [];

    /**
     * tasksApiProjectGetListResponse constructor.
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
        return 200;
    }

    public function getResponseBody(): array
    {
        return $this->projects;
    }
}
