<?php

final class tasksContactRights
{
    /**
     * @var bool
     */
    private $isAdmin = false;

    /**
     * @var bool
     */
    private $hasFullAccess = false;

    /**
     * @var bool
     */
    private $canViewAllProjects = false;

    /**
     * @var array<int>
     */
    private $projectsWithFullAccess = [];

    /**
     * @var array<int>
     */
    private $projectsWithLimitedAccess = [];

    /**
     * @var array<int>
     */
    private $projectsWithAnyAccess = [];

    public function __construct(array $rights)
    {
        if (isset($rights['backend'])) {
            switch ($rights['backend']) {
                case PHP_INT_MAX:
                    $this->isAdmin = true;

                case tasksRights::PROJECT_ACCESS_FULL:
                    $this->hasFullAccess = true;
            }
        }

        foreach ($rights as $right => $access) {
            if (strpos($right, '.') !== false) {
                [$type, $id] = explode('.', $right);

                if ($type === 'project') {
                    switch ($access) {
                        case tasksRights::PROJECT_ACCESS_VIEW_ASSIGNED_TASKS:
                            if ($id === 'all') {
                                $this->canViewAllProjects = true;
                            } else {
                                $this->projectsWithLimitedAccess[] = (int) $id;
                            }
                            break;

                        case tasksRights::PROJECT_ACCESS_FULL:
                            if ($id === 'all') {
                                $this->canViewAllProjects = true;
                                $this->hasFullAccess = true;
                            } else {
                                $this->projectsWithFullAccess[] = (int) $id;
                            }
                            break;
                    }
                }
            }
        }

        $this->projectsWithAnyAccess = array_merge($this->projectsWithLimitedAccess, $this->projectsWithFullAccess);
    }

    /**
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->isAdmin;
    }

    /**
     * @return bool
     */
    public function hasFullAccess(): bool
    {
        return $this->hasFullAccess;
    }

    /**
     * @return int[]
     */
    public function getProjectsWithFullAccess(): array
    {
        return $this->projectsWithFullAccess;
    }

    /**
     * @return int[]
     */
    public function getProjectsWithLimitedAccess(): array
    {
        return $this->projectsWithLimitedAccess;
    }

    /**
     * @return int[]
     */
    public function getProjectsWithAnyAccess(): array
    {
        return $this->projectsWithAnyAccess;
    }

    /**
     * @return bool
     */
    public function canViewAllProjects(): bool
    {
        return $this->canViewAllProjects;
    }
}
