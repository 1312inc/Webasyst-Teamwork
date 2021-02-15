<?php

final class tasksApiProjectGetListHandler
{
    /**
     * @return array<tasksProject>
     */
    public function getProjects(): array
    {
        /** @var tasksProject[] $tasks */
        $tasks = tsks()->getEntityRepository(tasksProject::class)->findAll();

        return $tasks;
    }
}
