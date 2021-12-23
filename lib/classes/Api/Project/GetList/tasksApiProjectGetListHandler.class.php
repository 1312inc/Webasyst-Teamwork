<?php

final class tasksApiProjectGetListHandler
{
    /**
     * @return array<tasksProject>
     */
    public function getProjects(): array
    {
        return tsks()->getEntityRepository(tasksProject::class)
            ->getProjectsAsArray(tasksProjectRepository::GET_PROJECT_ACTIVE_AVAILABLE);
    }
}
