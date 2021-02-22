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
     * @var bool
     */
    private $archive;

    /**
     * tasksApiProjectArchiveRequest constructor.
     *
     * @param int               $id
     * @param bool              $archive
     * @param DateTimeImmutable $archive_datetime
     */
    public function __construct(int $id, bool $archive, DateTimeImmutable $archive_datetime)
    {
        $this->id = $id;
        $this->archive_datetime = $archive_datetime;
        $this->archive = $archive;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getArchiveDatetime(): DateTimeImmutable
    {
        return $this->archive_datetime;
    }

    public function isArchive(): bool
    {
        return $this->archive;
    }
}
