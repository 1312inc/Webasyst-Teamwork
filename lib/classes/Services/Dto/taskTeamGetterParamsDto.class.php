<?php

final class taskTeamGetterParamsDto
{
    private $projectId;
    private $onlyActive;
    private $withDisabled;
    private $withCalendarStatus;
    private $withInvited;

    public function __construct(
        ?int $projectId = null,
        bool $onlyActive = false,
        bool $withDisabled = false,
        bool $withCalendarStatus = false,
        bool $withInvited = false
    ) {
        $this->projectId = $projectId;
        $this->onlyActive = $onlyActive;
        $this->withDisabled = $withDisabled;
        $this->withCalendarStatus = $withCalendarStatus;
        $this->withInvited = $withInvited;
    }

    public function getProjectId(): ?int
    {
        return $this->projectId;
    }

    public function isOnlyActive(): bool
    {
        return $this->onlyActive;
    }

    public function isWithDisabled(): bool
    {
        return $this->withDisabled;
    }

    public function isWithCalendarStatus(): bool
    {
        return $this->withCalendarStatus;
    }

    public function isWithInvited(): bool
    {
        return $this->withInvited;
    }
}
