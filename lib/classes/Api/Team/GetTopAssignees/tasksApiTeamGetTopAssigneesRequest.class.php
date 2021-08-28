<?php

final class tasksApiTeamGetTopAssigneesRequest
{
    /**
     * @var int
     */
    private $projectId;

    /**
     * @var int|null
     */
    private $statusId;

    public function __construct(int $projectId, ?int $statusId)
    {
        $this->statusId = $statusId;
        $this->projectId = $projectId;
    }

    public function getProjectId(): int
    {
        return $this->projectId;
    }

    public function getStatusId(): ?int
    {
        return $this->statusId;
    }
}
