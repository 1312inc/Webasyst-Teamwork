<?php

final class tasksOptions
{
    public static function getTasksPerPage(): int
    {
        return (int) tsks()->getOption('tasks_per_page');
    }

    public static function getTasksPriorities(): array
    {
        return tsks()->getOption('priorities');
    }
}
