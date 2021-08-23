<?php

final class tasksApiMilestoneResponse implements tasksApiResponseInterface
{
    /**
     * @var tasksApiMilestoneDto
     */
    private $milestoneDto;

    /**
     * tasksApiMilestoneResponse constructor.
     *
     * @param tasksMilestone $milestone
     */
    public function __construct(tasksMilestone $milestone)
    {
        $this->milestoneDto = tasksApiMilestoneDtoFactory::fromEntity(
            $milestone,
            tasksApiCountsDtoFactory::createForMilestoneId($milestone->getId())
        );
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody(): tasksApiMilestoneDto
    {
        return $this->milestoneDto;
    }
}
