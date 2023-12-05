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
     * @param array $milestones
     */
    public function __construct(array $milestones)
    {
        $counts = tasksApiCountsDtoFactory::createForMilestones();

        $accessedProjects = (new tasksRights())->getAvailableProjectForContact(wa()->getUser());
        if (is_array($accessedProjects)) {
            $projects_counts_allowed = array_fill_keys($accessedProjects[tasksRights::PROJECT_ACCESS_FULL], true);
        } else {
            $projects_counts_allowed = array_fill_keys(array_column($milestones, 'project_id'), true);
        }

        $sort = 0;
        foreach ($milestones as $milestone) {
            $milestone['sort'] = $sort++;
            $project_id = $milestone['project_id'];
            if (empty($projects_counts_allowed[$project_id])) {
                $counts_dto = tasksApiCountsDtoFactory::createUnavailable();
            } else {
                $counts_dto = $counts[$milestone['id']] ?? tasksApiCountsDtoFactory::createEmpty();
            }
            $this->milestones[] = tasksApiMilestoneDtoFactory::fromArray($milestone, $counts_dto);
        }
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody(): array
    {
        return [
            'total_count' => count($this->milestones),
            'data' => $this->milestones,
        ];
    }
}
