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

        $accessedProjects = (new tasksRights())->getAvailableProjectForContact(wa()->getUser());
        $projects_counts_allowed = array_fill_keys($accessedProjects[tasksRights::PROJECT_ACCESS_FULL], true);

        $sort = 0;
        foreach ($projects as $project) {
            $project['sort'] = $sort++;
            if (empty($projects_counts_allowed[$project['id']])) {
                $counts_dto = tasksApiCountsDtoFactory::createUnavailable();
            } else {
                $counts_dto = $counts[$project['id']] ?? tasksApiCountsDtoFactory::createEmpty();
            }
            $this->projects[] = tasksApiProjectDtoFactory::createFromArray($project, $counts_dto);
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
