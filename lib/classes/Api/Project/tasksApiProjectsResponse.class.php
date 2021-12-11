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

        $sort = 0;
        foreach ($projects as $project) {
            $project['sort'] = $sort++;
            $this->projects[] = tasksApiProjectDtoFactory::createFromArray(
                $project,
                $counts[$project['id']] ?? tasksApiCountsDtoFactory::createEmpty()
            );
        }
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody(): array
    {
        return [
            'total_count' => count($this->projects),
            'data' => $this->projects,
        ];
    }
}
