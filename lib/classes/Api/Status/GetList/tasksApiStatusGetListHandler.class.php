<?php

final class tasksApiStatusGetListHandler
{
    /**
     * @return array<array<string, mixed>>
     */
    public function getStatuses(): array
    {
        return tasksHelper::getStatuses(null, false);
    }
}
