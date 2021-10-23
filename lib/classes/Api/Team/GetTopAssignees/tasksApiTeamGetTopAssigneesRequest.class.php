<?php

final class tasksApiTeamGetTopAssigneesRequest
{
    /**
     * @var int|null
     */
    private $projectId;

    public function __construct(?int $projectId)
    {
        $this->projectId = $projectId;
    }

    public function getProjectId(): ?int
    {
        return $this->projectId;
    }
}
