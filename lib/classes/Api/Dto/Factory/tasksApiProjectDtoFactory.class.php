<?php

final class tasksApiProjectDtoFactory
{
    /**
     * @var tasksApiProjectDto[]
     */
    private static $projects;

    public static function createFromArray(array $data, tasksApiCountsDto $countsDto): tasksApiProjectDto
    {
        $id = (int) $data['id'];
        if (!isset(self::$projects[$id])) {
            self::$projects[$id] = new tasksApiProjectDto(
                $id,
                $data['name'],
                (int) $data['contact_id'],
                DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $data['create_datetime']),
                $data['icon'],
                $data['color'],
                !empty($data['archive_datetime'])
                    ? DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $data['archive_datetime'])
                    : null,
                (int) $data['sort'],
                $countsDto
            );
        }

        return self::$projects[$id];
    }

    public static function fromEntity(tasksProject $project, tasksApiCountsDto $countsDto): tasksApiProjectDto
    {
        $id = (int) $project->getId();

        if (!isset(self::$projects[$id])) {
            self::$projects[$id] = new tasksApiProjectDto(
                $id,
                $project->getName(),
                $project->getContactId(),
                $project->getCreateDatetime(),
                $project->getIcon(),
                $project->getColor(),
                $project->getArchiveDatetime(),
                $project->getSort(),
                $countsDto
            );
        }

        return self::$projects[$id];
    }
}
