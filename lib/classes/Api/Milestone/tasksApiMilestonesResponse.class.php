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
        foreach ($milestones as $milestone) {
            $this->milestones[] = tasksApiMilestoneDto::fromArray($milestone);
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
