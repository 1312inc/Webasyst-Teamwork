<?php

final class tasksApiMilestoneArchiveRequest
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var bool
     */
    private $archive;

    /**
     * tasksApiMilestoneArchiveRequest constructor.
     *
     * @param int  $id
     * @param bool $archive
     */
    public function __construct(int $id, bool $archive)
    {
        $this->id = $id;
        $this->archive = $archive;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function isArchive(): bool
    {
        return $this->archive;
    }
}
