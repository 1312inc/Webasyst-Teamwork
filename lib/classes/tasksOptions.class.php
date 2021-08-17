<?php

final class tasksOptions
{
    public static function getTasksPerPage(): int
    {
        return (int) tsks()->getConfig()->getOption('tasks_per_page');
    }
}
