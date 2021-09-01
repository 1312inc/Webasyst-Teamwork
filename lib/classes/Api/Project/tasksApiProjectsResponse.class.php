<?php

final class tasksApiProjectsResponse implements tasksApiResponseInterface
{
    /**
     * @var array<tasksApiProjectDto>
     */
    private $projects;

    /**
     * tasksApiProjectsResponse constructor.
     *
     * @param array<tasksProject> $projects
     */
    public function __construct(array $projects)
    {
        $counts = tasksApiCountsDtoFactory::createForProjects();

        foreach ($projects as $project) {
            $this->projects[] = tasksApiProjectDtoFactory::fromEntity(
                $project,
                $counts[$project->getId()] ?? tasksApiCountsDtoFactory::createEmpty()
            );
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
