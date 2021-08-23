<?php

class tasksApiStatusDtoFactory
{
    public static function createFromArray(array $data, tasksApiCountsDto $countsDto): tasksApiStatusDto
    {
        return new tasksApiStatusDto(
            (int) $data['id'],
            $data['name'],
            $data['button'] ?? '',
            filter_var($data['special'], FILTER_VALIDATE_BOOLEAN),
            $data['icon'] ?? '',
            $data['icon_url'] ?? null,
            $data['icon_class'] ?? null,
            $data['icon_html'] ?? null,
            (int) $data['sort'],
            tasksApiStatusParamsDto::createFromArray(
                isset($data['params']) && is_array($data['params']) ? $data['params'] : []
            ),
            $countsDto
        );
    }
}
