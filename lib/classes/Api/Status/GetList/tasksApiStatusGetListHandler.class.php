<?php

final class tasksApiStatusGetListHandler
{
    /**
     * @return array<array<string, mixed>>
     */
    public function getStatuses(): array
    {
        $statusesData = tasksHelper::getStatuses(null, false);

        $statusesData[tasksStatusModel::STATUS_OPEN_ID]['params'] = [
            'button_color' => '#22d13d',
            'title_color' => '#ffffff',
        ];
        $statusesData[tasksStatusModel::STATUS_CLOSED_ID]['params'] = [
            'button_color' => '#888888',
            'title_color' => '#ffffff',
        ];

        return $statusesData;
    }
}
