<?php

final class tasksApiProjectDtoFactory
{
    /**
     * @var tasksApiProjectDto[]
     */
    private static $projects;

    public static function create(array $data): tasksApiProjectDto
    {
        $id = (int) $data['id'];
        if (!isset(self::$projects[$id])) {
            self::$projects[$id] = new tasksApiProjectDto(
                $id,
                $data['name'],
                (int) $data['contact_id'],
                DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $data['create_datetime']),
                (int) $data['tasks_number'],
                $data['icon'],
                $data['color'],
                !empty($data['archive_datetime']) ? $data['archive_datetime'] : null,
                (int) $data['sort']
            );
        }

        return self::$projects[$id];
    }

    public static function fromEntity(tasksProject $project): tasksApiProjectDto
    {
        $id = (int) $project->getId();
        if (!isset(self::$projects[$id])) {
            self::$projects[$id] = new tasksApiProjectDto(
                $id,
                $project->getName(),
                $project->getContactId(),
                $project->getCreateDatetime(),
                $project->getTasksNumber(),
                $project->getIcon(),
                $project->getColor(),
                $project->getArchiveDatetime(),
                $project->getSort()
            );
        }

        return self::$projects[$id];
    }
}
