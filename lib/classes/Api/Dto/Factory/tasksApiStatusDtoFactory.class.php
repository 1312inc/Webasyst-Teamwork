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
            (int) $data['sort'],
            tasksApiStatusParamsDto::createFromArray(
                isset($data['params']) && is_array($data['params']) ? $data['params'] : []
            ),
            $countsDto
        );
    }
}
