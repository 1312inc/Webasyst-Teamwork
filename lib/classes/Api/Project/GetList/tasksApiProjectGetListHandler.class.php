<?php

final class tasksApiProjectGetListHandler
{
    /**
     * @return array<tasksProject>
     */
    public function getProjects(): array
    {
        return tsks()->getEntityRepository(tasksProject::class)->findAll();
    }
}
