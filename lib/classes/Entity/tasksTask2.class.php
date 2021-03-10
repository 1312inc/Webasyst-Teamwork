<?php

class tasksTask2 implements tasksPersistableInterface
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
     * @var string
     */
    private $text = '';

    /**
     * @var int
     */
    private $project_id;

    /**
     * @var int
     */
    private $create_contact_id;

    /**
     * @var int
     */
    private $assigned_contact_id;

    /**
     * @var int|null
     */
    private $milestone_id;

    /**
     * @var int
     */
    private $number;

    /**
     * @var int
     */
    private $status_id = 0;

    /**
     * @var int|null
     */
    private $parent_id;

    /**
     * @var int
     */
    private $priority = 0;

    /**
     * @var int
     */
    private $assign_log_id;

    /**
     * @var int|null
     */
    private $contact_id;

    /**
     * @var int
     */
    private $hidden_timestamp = 0;

    /**
     * @var int|null
     */
    private $comment_log_id;

    /**
     * @var DateTimeImmutable
     */
    private $create_datetime;

    /**
     * @var DateTimeImmutable|null
     */
    private $update_datetime;

    /**
     * @var DateTimeImmutable|null
     */
    private $due_date;

    public function __construct()
    {
        $this->create_datetime = new DateTimeImmutable();
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @param int|null $id
     *
     * @return tasksTask2
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     *
     * @return tasksTask2
     */
    public function setName(string $name): tasksTask2
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getText(): string
    {
        return $this->text;
    }

    /**
     * @param string $text
     *
     * @return tasksTask2
     */
    public function setText(string $text): tasksTask2
    {
        $this->text = $text;

        return $this;
    }

    /**
     * @return int
     */
    public function getProjectId(): int
    {
        return $this->project_id;
    }

    /**
     * @param int $project_id
     *
     * @return tasksTask2
     */
    public function setProjectId(int $project_id): tasksTask2
    {
        $this->project_id = $project_id;

        return $this;
    }

    /**
     * @return int
     */
    public function getCreateContactId(): int
    {
        return $this->create_contact_id;
    }

    /**
     * @param int $create_contact_id
     *
     * @return tasksTask2
     */
    public function setCreateContactId(int $create_contact_id): tasksTask2
    {
        $this->create_contact_id = $create_contact_id;

        return $this;
    }

    /**
     * @return int
     */
    public function getAssignedContactId(): int
    {
        return $this->assigned_contact_id;
    }

    /**
     * @param int $assigned_contact_id
     *
     * @return tasksTask2
     */
    public function setAssignedContactId(int $assigned_contact_id): tasksTask2
    {
        $this->assigned_contact_id = $assigned_contact_id;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getMilestoneId(): ?int
    {
        return $this->milestone_id;
    }

    /**
     * @param int|null $milestone_id
     *
     * @return tasksTask2
     */
    public function setMilestoneId(?int $milestone_id): tasksTask2
    {
        $this->milestone_id = $milestone_id;

        return $this;
    }

    /**
     * @return int
     */
    public function getNumber(): int
    {
        return $this->number;
    }

    /**
     * @param int $number
     *
     * @return tasksTask2
     */
    public function setNumber(int $number): tasksTask2
    {
        $this->number = $number;

        return $this;
    }

    /**
     * @return int
     */
    public function getStatusId(): int
    {
        return $this->status_id;
    }

    /**
     * @param int $status_id
     *
     * @return tasksTask2
     */
    public function setStatusId(int $status_id): tasksTask2
    {
        $this->status_id = $status_id;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getParentId(): ?int
    {
        return $this->parent_id;
    }

    /**
     * @param int|null $parent_id
     *
     * @return tasksTask2
     */
    public function setParentId(?int $parent_id): tasksTask2
    {
        $this->parent_id = $parent_id;

        return $this;
    }

    /**
     * @return int
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * @param int $priority
     *
     * @return tasksTask2
     */
    public function setPriority(int $priority): tasksTask2
    {
        $this->priority = $priority;

        return $this;
    }

    /**
     * @return int
     */
    public function getAssignLogId(): int
    {
        return $this->assign_log_id;
    }

    /**
     * @param int $assign_log_id
     *
     * @return tasksTask2
     */
    public function setAssignLogId(int $assign_log_id): tasksTask2
    {
        $this->assign_log_id = $assign_log_id;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getContactId(): ?int
    {
        return $this->contact_id;
    }

    /**
     * @param int|null $contact_id
     *
     * @return tasksTask2
     */
    public function setContactId(?int $contact_id): tasksTask2
    {
        $this->contact_id = $contact_id;

        return $this;
    }

    /**
     * @return int
     */
    public function getHiddenTimestamp(): int
    {
        return $this->hidden_timestamp;
    }

    /**
     * @param int $hidden_timestamp
     *
     * @return tasksTask2
     */
    public function setHiddenTimestamp(int $hidden_timestamp): tasksTask2
    {
        $this->hidden_timestamp = $hidden_timestamp;

        return $this;
    }

    /**
     * @return int|null
     */
    public function getCommentLogId(): ?int
    {
        return $this->comment_log_id;
    }

    /**
     * @param int|null $comment_log_id
     *
     * @return tasksTask2
     */
    public function setCommentLogId(?int $comment_log_id): tasksTask2
    {
        $this->comment_log_id = $comment_log_id;

        return $this;
    }

    /**
     * @return DateTimeImmutable
     */
    public function getCreateDatetime(): DateTimeImmutable
    {
        return $this->create_datetime;
    }

    /**
     * @param DateTimeImmutable $create_datetime
     *
     * @return tasksTask2
     */
    public function setCreateDatetime(DateTimeImmutable $create_datetime): tasksTask2
    {
        $this->create_datetime = $create_datetime;

        return $this;
    }

    /**
     * @return DateTimeImmutable|null
     */
    public function getUpdateDatetime(): ?DateTimeImmutable
    {
        return $this->update_datetime;
    }

    /**
     * @param DateTimeImmutable|null $update_datetime
     *
     * @return tasksTask2
     */
    public function setUpdateDatetime(?DateTimeImmutable $update_datetime): tasksTask2
    {
        $this->update_datetime = $update_datetime;

        return $this;
    }

    /**
     * @return DateTimeImmutable|null
     */
    public function getDueDate(): ?DateTimeImmutable
    {
        return $this->due_date;
    }

    /**
     * @param DateTimeImmutable|null $due_date
     *
     * @return tasksTask2
     */
    public function setDueDate(?DateTimeImmutable $due_date): tasksTask2
    {
        $this->due_date = $due_date;

        return $this;
    }

    public function convertToSqlValues(array $fields): array
    {
        $converted = [];

        if ($this->due_date) {
            $converted['due_date'] = $this->due_date->format('Y-m-d');
        }

        return $converted;
    }

    public function convertToPhpValues(array &$dbValues): void
    {
        $dbValues['id'] = (int) $dbValues['id'];
        $dbValues['project_id'] = (int) $dbValues['project_id'];
        $dbValues['closed'] = (int) $dbValues['closed'];

        if (!empty($dbValues['due_date'])) {
            $dbValues['due_date'] = DateTimeImmutable::createFromFormat('Y-m-d|', $dbValues['due_date']);
        }
    }
}