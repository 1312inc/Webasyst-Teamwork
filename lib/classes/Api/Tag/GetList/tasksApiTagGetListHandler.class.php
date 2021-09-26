<?php

final class tasksApiTagGetListHandler
{
    /**
     * @return array<array<string, mixed>>
     */
    public function getTags(): array
    {
        return (new tasksTagModel())->getAll();
    }
}
