<?php

class tasksAttachment implements tasksPersistableInterface
{
    /**
     * @var int|null
     */
    private $id;

    /**
     * @var int
     */
    private $task_id;

    /**
     * @var int
     */
    private $log_id;

    /**
     * @var DateTimeImmutable
     */
    private $create_datetime;

    /**
     * @var int
     */
    private $contact_id;

    /**
     * @var int
     */
    private $size;

    /**
     * @var string
     */
    private $ext;

    /**
     * @var string
     */
    private $code;

    /**
     * @var string
     */
    private $name;

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


    public function getContact(): waContact
    {
        return $this->contact;
    }

    public function getTaskId(): int
    {
        return $this->task_id;
    }

    public function getLogId(): int
    {
        return $this->log_id;
    }

    public function getSize(): int
    {
        return $this->size;
    }

    public function getExt(): string
    {
        return $this->ext;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    /**
     * @param int|null $id
     *
     * @return tasksAttachment
     */
    public function setId($id): tasksAttachment
    {
        $this->id = $id;

        return $this;
    }

    public function setName(string $name): tasksAttachment
    {
        $this->name = $name;

        return $this;
    }

    public function setContactId(int $contact_id): tasksAttachment
    {
        $this->contact_id = $contact_id;

        return $this;
    }

    public function setCreateDatetime(DateTimeImmutable $create_datetime): tasksAttachment
    {
        $this->create_datetime = $create_datetime;

        return $this;
    }

    public function setContact(waContact $contact): tasksAttachment
    {
        $this->contact = $contact;

        return $this;
    }

    /**
     * @param int $task_id
     *
     * @return tasksAttachment
     */
    public function setTaskId(int $task_id): tasksAttachment
    {
        $this->task_id = $task_id;

        return $this;
    }

    /**
     * @param int $log_id
     *
     * @return tasksAttachment
     */
    public function setLogId(int $log_id): tasksAttachment
    {
        $this->log_id = $log_id;

        return $this;
    }

    /**
     * @param int $size
     *
     * @return tasksAttachment
     */
    public function setSize(int $size): tasksAttachment
    {
        $this->size = $size;

        return $this;
    }

    /**
     * @param string $ext
     *
     * @return tasksAttachment
     */
    public function setExt(string $ext): tasksAttachment
    {
        $this->ext = $ext;

        return $this;
    }

    /**
     * @param string $code
     *
     * @return tasksAttachment
     */
    public function setCode(string $code): tasksAttachment
    {
        $this->code = $code;

        return $this;
    }

    public function convertToSqlValues(array $fields): array
    {
        $converted = [];
        $converted['create_datetime'] = $this->create_datetime->format('Y-m-d H:i:s');

        return $converted;
    }

    public function convertToPhpValues(array &$dbValues): void
    {
        $dbValues['id'] = (int) $dbValues['id'];
        $dbValues['contact_id'] = (int) $dbValues['contact_id'];
        $dbValues['task_id'] = (int) $dbValues['task_id'];
        $dbValues['log_id'] = (int) $dbValues['log_id'];
        $dbValues['size'] = (int) $dbValues['size'];
        $dbValues['create_datetime'] = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $dbValues['create_datetime']);
    }
}
