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
     * @var ?int
     */
    private $assigned_contact_id;

    /**
     * @var int|null
     */
    private $milestone_id;

    /**
     * @var ?int
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
     * @var ?int
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

    /**
     * @var ?tasksTask
     */
    private $legacy_task;

    /**
     * @var tasksProject
     */
    private $project;

    /**
     * @var string
     */
    private $uuid;

    /**
     * @var string|null
     */
    private $public_hash = null;

    public function __construct()
    {
        $this->create_datetime = new DateTimeImmutable();
        $this->update_datetime = new DateTimeImmutable();
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

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): tasksTask2
    {
        $this->name = $name;

        return $this;
    }

    public function getText(): string
    {
        return $this->text;
    }

    public function setText(string $text): tasksTask2
    {
        $this->text = $text;

        return $this;
    }

    public function getProjectId(): int
    {
        return $this->project_id;
    }

    public function setProjectId(int $project_id): tasksTask2
    {
        $this->project_id = $project_id;

        return $this;
    }

    public function setProject(tasksProject $project): tasksTask2
    {
        $this->project = $project;
        $this->project_id = $project->getId();

        return $this;
    }

    /**
     * @return tasksProject
     */
    public function getProject(): tasksProject
    {
        return $this->project;
    }

    public function getCreateContactId(): int
    {
        return $this->create_contact_id;
    }

    public function setCreateContactId(int $create_contact_id): tasksTask2
    {
        $this->create_contact_id = $create_contact_id;

        return $this;
    }

    public function getAssignedContactId(): ?int
    {
        return $this->assigned_contact_id;
    }

    public function setAssignedContactId(?int $assigned_contact_id): tasksTask2
    {
        $this->assigned_contact_id = $assigned_contact_id;

        return $this;
    }

    public function getMilestoneId(): ?int
    {
        return $this->milestone_id;
    }

    public function setMilestoneId(?int $milestone_id): tasksTask2
    {
        $this->milestone_id = $milestone_id;

        return $this;
    }

    public function getNumber(): ?int
    {
        return $this->number;
    }

    public function setNumber(int $number): tasksTask2
    {
        $this->number = $number;

        return $this;
    }

    public function getStatusId(): int
    {
        return $this->status_id;
    }

    public function setStatusId(int $status_id): tasksTask2
    {
        $this->status_id = $status_id;

        return $this;
    }

    public function getParentId(): ?int
    {
        return $this->parent_id;
    }

    public function setParentId(?int $parent_id): tasksTask2
    {
        $this->parent_id = $parent_id;

        return $this;
    }

    public function getPriority(): int
    {
        return $this->priority;
    }

    public function setPriority(int $priority): tasksTask2
    {
        $this->priority = $priority;

        return $this;
    }

    public function getAssignLogId(): ?int
    {
        return $this->assign_log_id;
    }

    public function setAssignLogId(?int $assign_log_id): tasksTask2
    {
        $this->assign_log_id = $assign_log_id;

        return $this;
    }

    public function getContactId(): ?int
    {
        return $this->contact_id;
    }

    public function setContactId(?int $contact_id): tasksTask2
    {
        $this->contact_id = $contact_id;

        return $this;
    }

    public function getHiddenTimestamp(): int
    {
        return $this->hidden_timestamp;
    }

    public function setHiddenTimestamp(int $hidden_timestamp): tasksTask2
    {
        $this->hidden_timestamp = $hidden_timestamp;

        return $this;
    }

    public function getCommentLogId(): ?int
    {
        return $this->comment_log_id;
    }

    public function setCommentLogId(?int $comment_log_id): tasksTask2
    {
        $this->comment_log_id = $comment_log_id;

        return $this;
    }

    public function getCreateDatetime(): DateTimeImmutable
    {
        return $this->create_datetime;
    }

    public function setCreateDatetime(DateTimeImmutable $create_datetime): tasksTask2
    {
        $this->create_datetime = $create_datetime;

        return $this;
    }

    public function getUpdateDatetime(): ?DateTimeImmutable
    {
        return $this->update_datetime;
    }

    public function setUpdateDatetime(?DateTimeImmutable $update_datetime): tasksTask2
    {
        $this->update_datetime = $update_datetime;

        return $this;
    }

    public function getDueDate(): ?DateTimeImmutable
    {
        return $this->due_date;
    }

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
        if ($this->update_datetime) {
            $converted['update_datetime'] = $this->update_datetime->format('Y-m-d H:i:s');
        }
        $converted['create_datetime'] = $this->create_datetime->format('Y-m-d');

        return $converted;
    }

    public function convertToPhpValues(array &$dbValues): void
    {
        $dbValues['id'] = (int) $dbValues['id'];
        $dbValues['project_id'] = (int) $dbValues['project_id'];
        $dbValues['create_contact_id'] = (int) $dbValues['create_contact_id'];
        $dbValues['number'] = (int) $dbValues['number'];
        $dbValues['status_id'] = (int) $dbValues['status_id'];
        $dbValues['parent_id'] = (int) $dbValues['parent_id'];
        $dbValues['contact_id'] = (int) $dbValues['contact_id'];
        $dbValues['priority'] = (int) $dbValues['priority'];
        $dbValues['hidden_timestamp'] = (int) $dbValues['hidden_timestamp'];
        $dbValues['assigned_contact_id'] = !empty($dbValues['assigned_contact_id']) ? (int) $dbValues['assigned_contact_id'] : null;
        $dbValues['milestone_id'] = !empty($dbValues['milestone_id']) ? (int) $dbValues['milestone_id'] : null;
        $dbValues['assign_log_id'] = !empty($dbValues['assign_log_id']) ? (int) $dbValues['assign_log_id'] : null;
        $dbValues['comment_log_id'] = !empty($dbValues['comment_log_id']) ? (int) $dbValues['assigned_contact_id'] : null;

        if (!empty($dbValues['due_date'])) {
            $dbValues['due_date'] = DateTimeImmutable::createFromFormat('Y-m-d|', $dbValues['due_date']);
        }
        if (!empty($dbValues['create_datetime'])) {
            $dbValues['create_datetime'] = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $dbValues['create_datetime']);
        }
        if (!empty($dbValues['update_datetime'])) {
            $dbValues['update_datetime'] = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $dbValues['update_datetime']);
        }
    }

    public function getLegacyTask(): ?tasksTask
    {
        return $this->legacy_task;
    }

    public function setLegacyTask(tasksTask $legacy_task): tasksTask2
    {
        $this->legacy_task = $legacy_task;

        return $this;
    }

    public function getUuid(): string
    {
        return $this->uuid;
    }

    public function setUuid(string $uuid): tasksTask2
    {
        $this->uuid = $uuid;

        return $this;
    }

    public function getPublicHash(): ?string
    {
        return $this->public_hash;
    }

    public function setPublicHash(?string $public_hash): tasksTask2
    {
        $this->public_hash = $public_hash;

        return $this;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'text' => $this->text,
            'create_contact_id' => $this->create_contact_id,
            'create_datetime' => $this->create_datetime->format('Y-m-d H:i:s'),
            'update_datetime' => $this->update_datetime ? $this->update_datetime->format('Y-m-d H:i:s') : '',
            'assigned_contact_id' => $this->assigned_contact_id,
            'project_id' => $this->project_id,
            'milestone_id' => $this->milestone_id,
            'number' => $this->number,
            'status_id' => $this->status_id,
            'parent_id' => $this->parent_id,
            'priority' => $this->priority,
            'assign_log_id' => $this->assigned_contact_id,
            'contact_id' => $this->contact_id,
            'hidden_timestamp' => $this->hidden_timestamp,
            'due_date' => $this->due_date ? $this->due_date->format('Y-m-d H:i:s') : '',
            'comment_log_id' => $this->comment_log_id,
            'uuid' => $this->uuid,
            '$this->public_hash' => $this->public_hash,
        ];
    }
}
