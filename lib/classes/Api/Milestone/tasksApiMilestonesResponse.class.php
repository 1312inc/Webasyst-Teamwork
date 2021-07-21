<?php

final class tasksApiMilestonesResponse implements tasksApiResponseInterface
{
    /**
     * @var array<tasksApiMilestoneDto>
     */
    private $milestones = [];

    /**
     * tasksApiMilestonesResponse constructor.
     *
     * @param array<tasksMilestone> $projects
     */
    public function __construct(array $projects)
    {
        foreach ($projects as $project) {
            $this->milestones[] = tasksApiMilestoneDto::fromEntity($project);
        }
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody(): array
    {
        return $this->milestones;
    }
}
