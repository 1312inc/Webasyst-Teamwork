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
        int $contactId,
        DateTimeImmutable $createDatetime,
        string $icon,
        string $color,
        ?DateTimeImmutable $archiveDatetime,
        int $sort,
        tasksApiCountsDto $counts
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->contact = tasksApiContactDtoFactory::fromContactId($contactId);
        $this->create_datetime = $createDatetime->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d\TH:i:sP');
        $this->icon = $icon;
        $this->color = $color;
        $this->archive_datetime = $archiveDatetime
            ? $archiveDatetime->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d\TH:i:sP')
            : null;
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
