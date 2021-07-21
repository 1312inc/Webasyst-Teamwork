<?php

final class tasksApiTagDtoFactory
{
    /**
     * @var tasksApiTagDto[]
     */
    private static $tags;

    public static function create(array $data): tasksApiTagDto
    {
        $id = (int) $data['id'];
        if (!isset(self::$tags[$id])) {
            self::$tags[$id] = new tasksApiTagDto(
                $id,
                $data['name'],
                (bool) $data['favorite']
            );
        }

        return self::$tags[$id];
    }
}
