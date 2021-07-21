<?php

final class tasksApiProjectGetListHandler
{
    /**
     * @return array<tasksProject>
     */
    public function getProjects(): array
    {
        /** @var tasksProject[] $projects */
        $projects = tsks()->getEntityRepository(tasksProject::class)->findAll();

        return $projects;
    }
}
