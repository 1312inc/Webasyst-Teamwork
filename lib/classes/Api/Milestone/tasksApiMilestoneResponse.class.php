<?php

final class tasksApiMilestoneResponse implements tasksApiResponseInterface
{
    /**
     * @var tasksApiMilestoneDto
     */
    private $project;

    /**
     * tasksApiMilestoneResponse constructor.
     *
     * @param tasksMilestone $milestone
     */
    public function __construct(tasksMilestone $milestone)
    {
        $this->project = tasksApiMilestoneDto::fromEntity($milestone);
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody(): tasksApiMilestoneDto
    {
        return $this->project;
    }
}
