<?php

final class tasksApiTeamGetTopAssigneesRequest
{
    /**
     * @var int
     */
    private $createContactId;

    /**
     * @var int
     */
    private $projectId;

    /**
     * @var int|null
     */
    private $statusId;

    public function __construct(int $createContactId, int $projectId, ?int $statusId)
    {
        $this->createContactId = $createContactId;
        $this->statusId = $statusId;
        $this->projectId = $projectId;
    }

    public function getCreateContactId(): int
    {
        return $this->createContactId;
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
