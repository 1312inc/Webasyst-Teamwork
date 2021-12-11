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

        $sort = 0;
        foreach ($milestones as $milestone) {
            $milestone['sort'] = $sort++;
            $this->milestones[] = tasksApiMilestoneDtoFactory::fromArray(
                $milestone,
                $counts[$milestone['id']] ?? tasksApiCountsDtoFactory::createEmpty()
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
            'total_count' => count($this->milestones),
            'data' => $this->milestones,
        ];
    }
}
