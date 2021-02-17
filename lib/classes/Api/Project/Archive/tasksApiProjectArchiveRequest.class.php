<?php

final class tasksApiProjectArchiveRequest
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var DateTimeImmutable
     */
    private $archive_datetime;

    /**
     * tasksApiProjectArchiveRequest constructor.
     *
     * @param int               $id
     * @param DateTimeImmutable $archive_datetime
     */
    public function __construct(int $id, DateTimeImmutable $archive_datetime)
    {
        $this->id = $id;
        $this->archive_datetime = $archive_datetime;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getArchiveDatetime(): DateTimeImmutable
    {
        return $this->archive_datetime;
    }
}
