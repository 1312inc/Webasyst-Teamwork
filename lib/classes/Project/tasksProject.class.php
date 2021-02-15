<?php

class tasksProject implements tasksHydratableInterface
{
    /**
     * @var int|null
     */
    private $id;

    /**
     * @var string
     */
    private $name;

    /**
     * @var int
     */
    private $contact_id;

    /**
     * @var DateTimeImmutable
     */
    private $create_datetime;

    /**
     * @var int
     */
    private $tasks_number = 0;

    /**
     * @var string
     */
    private $icon = '';

    /**
     * @var string
     */
    private $color = '';

    /**
     * @var DateTimeImmutable|null
     */
    private $archive_datetime = null;

    /**
     * @var int
     */
    private $sort = 0;

    /**
     * @var waContact
     */
    private $contact;

    /**
     * tasksProject constructor.
     */
    public function __construct() {
        $this->create_datetime = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getContactId(): int
    {
        return $this->contact_id;
    }

    public function getCreateDatetime(): DateTimeImmutable
    {
        return $this->create_datetime;
    }

    public function getTasksNumber(): int
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

    public function getArchiveDatetime(): ?DateTimeImmutable
    {
        return $this->archive_datetime;
    }

    public function getSort(): int
    {
        return $this->sort;
    }

    public function getContact(): waContact
    {
        return $this->contact;
    }

    /**
     * @param int|null $id
     *
     * @return tasksProject
     */
    public function setId(?int $id): tasksProject
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @param string $name
     *
     * @return tasksProject
     */
    public function setName(string $name): tasksProject
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @param int $contact_id
     *
     * @return tasksProject
     */
    public function setContactId(int $contact_id): tasksProject
    {
        $this->contact_id = $contact_id;

        return $this;
    }

    /**
     * @param DateTimeImmutable $create_datetime
     *
     * @return tasksProject
     */
    public function setCreateDatetime(DateTimeImmutable $create_datetime): tasksProject
    {
        $this->create_datetime = $create_datetime;

        return $this;
    }

    /**
     * @param int $tasks_number
     *
     * @return tasksProject
     */
    public function setTasksNumber(int $tasks_number): tasksProject
    {
        $this->tasks_number = $tasks_number;

        return $this;
    }

    /**
     * @param string $icon
     *
     * @return tasksProject
     */
    public function setIcon(string $icon): tasksProject
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * @param string $color
     *
     * @return tasksProject
     */
    public function setColor(string $color): tasksProject
    {
        $this->color = $color;

        return $this;
    }

    /**
     * @param DateTimeImmutable|null $archive_datetime
     *
     * @return tasksProject
     */
    public function setArchiveDatetime(?DateTimeImmutable $archive_datetime): tasksProject
    {
        $this->archive_datetime = $archive_datetime;

        return $this;
    }

    /**
     * @param int $sort
     *
     * @return tasksProject
     */
    public function setSort(int $sort): tasksProject
    {
        $this->sort = $sort;

        return $this;
    }

    /**
     * @param waContact $contact
     *
     * @return tasksProject
     */
    public function setContact(waContact $contact): tasksProject
    {
        $this->contact = $contact;

        return $this;
    }

    public function convertToSqlValues(array &$fields): array
    {
        $converted = [];
        $converted['create_datetime'] = $this->create_datetime->format('Y-m-d H:i:s');

        if ($this->archive_datetime) {
            $converted['archive_datetime'] = $this->archive_datetime->format('Y-m-d H:i:s');
        }

        return $converted;
    }

    public function convertToPhpValues(array &$dbValues): void
    {
        $dbValues['create_datetime'] = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $dbValues['create_datetime']);

        if (!empty($dbValues['archive_datetime'])) {
            $dbValues['archive_datetime'] = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $dbValues['archive_datetime']);
        }
    }
}
