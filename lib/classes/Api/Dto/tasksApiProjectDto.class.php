<?php

final class tasksApiProjectDto implements JsonSerializable
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
     * @var tasksApiContactDto
     */
    private $contact;

    /**
     * @var string
     */
    private $create_datetime;

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

    /**
     * @var tasksApiCountsDto
     */
    private $counts;

    public function __construct(
        int $id,
        string $name,
        int $contact_id,
        DateTimeImmutable $create_datetime,
        string $icon,
        string $color,
        ?DateTimeImmutable $archive_datetime,
        int $sort,
        tasksApiCountsDto $counts
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->contact = tasksApiContactDtoFactory::fromContactId($contact_id);
        $this->create_datetime = $create_datetime->format('Y-m-d H:i:s');
        $this->icon = $icon;
        $this->color = $color;
        $this->archive_datetime = $archive_datetime ? $archive_datetime->format('Y-m-d H:i:s') : null;
        $this->sort = $sort;
        $this->counts = $counts;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getContact(): tasksApiContactDto
    {
        return $this->contact;
    }

    public function getCreateDatetime(): string
    {
        return $this->create_datetime;
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

    public function getCounts(): tasksApiCountsDto
    {
        return $this->counts;
    }
}
