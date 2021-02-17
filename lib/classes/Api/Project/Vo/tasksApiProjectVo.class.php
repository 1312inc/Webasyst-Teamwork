<?php

final class tasksApiProjectVo implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $name;

    /**
     * @var tasksApiContactVo
     */
    private $contact;

    /**
     * @var string
     */
    private $create_datetime;

    /**
     * @var int|null
     */
    private $tasks_number;

    /**
     * @var string
     */
    private $icon;

    /**
     * @var string
     */
    private $color;

    /**
     * @var string|null
     */
    private $archive_datetime;

    /**
     * @var int
     */
    private $sort;

    public function __construct(
        int $id,
        string $name,
        int $contact_id,
        DateTimeImmutable $create_datetime,
        ?int $tasks_number,
        string $icon,
        string $color,
        ?string $archive_datetime,
        int $sort
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->contact = tasksApiContactVo::fromContactId($contact_id);
        $this->create_datetime = $create_datetime->format('Y-m-d H:i:s');
        $this->tasks_number = $tasks_number;
        $this->icon = $icon;
        $this->color = $color;
        $this->archive_datetime = $archive_datetime;
        $this->sort = $sort;
    }

    public static function fromEntity(tasksProject $project): self
    {
        return new self(
            (int) $project->getId(),
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

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getContact(): tasksApiContactVo
    {
        return $this->contact;
    }

    public function getCreateDatetime(): string
    {
        return $this->create_datetime;
    }

    public function getTasksNumber(): ?int
    {
        return $this->tasks_number;
    }

    public function getIcon(): string
    {
        return $this->icon;
    }

    public function getColor(): string
    {
        return $this->color;
    }

    public function getArchiveDatetime(): ?string
    {
        return $this->archive_datetime;
    }

    public function getSort(): int
    {
        return $this->sort;
    }
}
