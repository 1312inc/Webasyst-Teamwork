<?php

class tasksRightsResolver
{
    /**
     * @var tasksContactRights[]
     */
    private $contactRights = [];

    public function contactHasFullAccess(waContact $contact): bool
    {
        return $this->loadContactRights($contact)->isAdmin() || $this->loadContactRights($contact)->hasFullAccess();
    }

    public function contactCanAccessToProject(waContact $contact, int $projectId): bool
    {
        return $this->contactHasFullAccess($contact)
            || $this->loadContactRights($contact)->canViewAllProjects()
            || in_array($projectId, $this->loadContactRights($contact)->getProjectsWithAnyAccess());
    }

    public function contactCanAddProject(waContact $contact): bool
    {
        return $this->contactHasFullAccess($contact);
    }

    private function loadContactRights(waContact $contact): tasksContactRights
    {
        if (!isset($this->contactRights[$contact->getId()])) {
            $this->contactRights[$contact->getId()] = new tasksContactRights(
                $contact->getRights(tasksConfig::APP_ID)
            );
        }

        return $this->contactRights[$contact->getId()];
    }
}
