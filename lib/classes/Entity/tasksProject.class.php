<?php

class tasksProject implements tasksPersistableInterface
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
    public function __construct()
    {
        $this->create_datetime = new DateTimeImmutable();
    }

    /**
     * @return int|null
     */
    public function getId()
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
    public function setId($id): tasksProject
    {
        $this->id = $id;

        return $this;
    }

    public function setName(string $name): tasksProject
    {
        $this->name = $name;

        return $this;
    }

    public function setContactId(int $contact_id): tasksProject
    {
        $this->contact_id = $contact_id;

        return $this;
    }

    public function setCreateDatetime(DateTimeImmutable $create_datetime): tasksProject
    {
        $this->create_datetime = $create_datetime;

        return $this;
    }

    public function setTasksNumber(int $tasks_number): tasksProject
    {
        $this->tasks_number = $tasks_number;

        return $this;
    }

    public function setIcon(string $icon): tasksProject
    {
        $this->icon = $icon;

        return $this;
    }

    public function setColor(string $color): tasksProject
    {
        $this->color = $color;

        return $this;
    }

    public function setArchiveDatetime(?DateTimeImmutable $archive_datetime): tasksProject
    {
        $this->archive_datetime = $archive_datetime;

        return $this;
    }

    public function setSort(int $sort): tasksProject
    {
        $this->sort = $sort;

        return $this;
    }

    public function setContact(waContact $contact): tasksProject
    {
        $this->contact = $contact;

        return $this;
    }

    public function convertToSqlValues(array $fields): array
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
        $dbValues['id'] = (int) $dbValues['id'];
        $dbValues['contact_id'] = (int) $dbValues['contact_id'];
        $dbValues['sort'] = (int) $dbValues['sort'];
        $dbValues['tasks_number'] = (int) $dbValues['tasks_number'];
        $dbValues['create_datetime'] = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $dbValues['create_datetime']);

        if (!empty($dbValues['archive_datetime'])) {
            $dbValues['archive_datetime'] = DateTimeImmutable::createFromFormat(
                'Y-m-d H:i:s',
                $dbValues['archive_datetime']
            );
        }
    }
}
