<?php

final class tasksApiTaskDto implements JsonSerializable
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
     * @var string
     */
    private $text;

    /**
     * @var string
     */
    private $text_stripped;

    /**
     * @var tasksApiContactDto
     */
    private $create_contact;

    /**
     * @var tasksApiContactDto|null
     */
    private $visavis_contact;

    /**
     * @var tasksApiContactDto|null
     */
    private $assignment_creator_contact;

    /**
     * @var string
     */
    private $create_datetime;

    /**
     * @var string|null
     */
    private $update_datetime;

    /**
     * @var tasksApiContactDto|null
     */
    private $assigned_contact;

    /**
     * @var int
     */
    private $project_id;

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
    private $status_id;

    /**
     * @var int|null
     */
    private $next_status_id;

    /**
     * @var int|null
     */
    private $return_status_id;

    /**
     * @var int|null
     */
    private $parent_id;

    /**
     * @var int
     */
    private $priority;

    /**
     * @var int|null
     */
    private $assign_log_id;

    /**
     * @var int|null
     */
    private $comment_log_id;

    /**
     * @var int|null
     */
    private $contact_id;

    /**
     * @var int
     */
    private $hidden_timestamp;

    /**
     * @var string|null
     */
    private $due_date;

    /**
     * @var tasksApiAttachmentDto[]
     */
    private $attachments;

    /**
     * @var tasksApiLogDto[]
     */
    private $log;

    /**
     * @var tasksApiTagDto[]
     */
    private $tags;

    /**
     * @var ?tasksApiProjectDto
     */
    private $project;

    /**
     * @var bool
     */
    private $favorite;

    /**
     * @var string|null
     */
    private $uuid;

    /**
     * @var tasksApiMilestoneDto|null
     */
    private $milestone;
    /**
     * @var array|null
     */
    private $publicLinks;

    public function __construct(
        int $id,
        string $name,
        string $text,
        tasksApiContactDto $createContact,
        ?tasksApiContactDto $visavisContact,
        ?tasksApiContactDto $assignmentCreatorContact,
        string $createDatetime,
        ?string $updateDatetime,
        ?tasksApiContactDto $assignedContact,
        int $projectId,
        ?int $milestoneId,
        int $number,
        int $statusId,
        ?int $nextStatusId,
        ?int $returnStatusId,
        ?int $parentId,
        int $priority,
        ?int $assignLogId,
        ?int $commentLogId,
        ?int $contactId,
        int $hiddenTimestamp,
        ?string $dueDate,
        array $allAttachments,
        array $log,
        array $tags,
        ?tasksApiProjectDto $project,
        bool $favorite,
        string $text_stripped,
        ?string $uuid,
        ?tasksApiMilestoneDto $milestone,
        ?array $publicLinks
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->text = $text;
        $this->create_contact = $createContact;
        $this->create_datetime = $createDatetime;
        $this->update_datetime = $updateDatetime;
        $this->assigned_contact = $assignedContact;
        $this->assignment_creator_contact = $assignmentCreatorContact;
        $this->project_id = $projectId;
        $this->milestone_id = $milestoneId;
        $this->number = $number;
        $this->status_id = $statusId;
        $this->parent_id = $parentId;
        $this->priority = $priority;
        $this->assign_log_id = $assignLogId;
        $this->comment_log_id = $commentLogId;
        $this->contact_id = $contactId;
        $this->hidden_timestamp = $hiddenTimestamp;
        $this->due_date = $dueDate;
        $this->attachments = $allAttachments;
        $this->log = $log;
        $this->tags = $tags;
        $this->project = $project;
        $this->visavis_contact = $visavisContact;
        $this->next_status_id = $nextStatusId;
        $this->return_status_id = $returnStatusId;
        $this->favorite = $favorite;
        $this->text_stripped = $text_stripped;
        $this->uuid = $uuid;
        $this->milestone = $milestone;
        $this->publicLinks = $publicLinks;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getText(): string
    {
        return $this->text;
    }

    public function getCreateContact(): tasksApiContactDto
    {
        return $this->create_contact;
    }

    public function getVisavisContact(): ?tasksApiContactDto
    {
        return $this->visavis_contact;
    }

    public function getAssignmentCreatorContact(): ?tasksApiContactDto
    {
        return $this->assignment_creator_contact;
    }

    public function getCreateDatetime(): string
    {
        return $this->create_datetime;
    }

    public function getUpdateDatetime(): ?string
    {
        return $this->update_datetime;
    }

    public function getAssignedContact(): ?tasksApiContactDto
    {
        return $this->assigned_contact;
    }

    public function getProjectId(): int
    {
        return $this->project_id;
    }

    public function getMilestoneId(): ?int
    {
        return $this->milestone_id;
    }

    public function getNumber(): int
    {
        return $this->number;
    }

    public function getStatusId(): int
    {
        return $this->status_id;
    }

    public function getNextStatusId(): ?int
    {
        return $this->next_status_id;
    }

    public function getReturnStatusId(): ?int
    {
        return $this->return_status_id;
    }

    public function getParentId(): ?int
    {
        return $this->parent_id;
    }

    public function getPriority(): int
    {
        return $this->priority;
    }

    public function getAssignLogId(): ?int
    {
        return $this->assign_log_id;
    }

    public function getCommentLogId(): ?int
    {
        return $this->comment_log_id;
    }

    public function getContactId(): ?int
    {
        return $this->contact_id;
    }

    public function getHiddenTimestamp(): int
    {
        return $this->hidden_timestamp;
    }

    public function getDueDate(): ?string
    {
        return $this->due_date;
    }

    public function getAttachments(): array
    {
        return $this->attachments;
    }

    public function getLog(): array
    {
        return $this->log;
    }

    public function getTags(): array
    {
        return $this->tags;
    }

    public function getProject(): ?tasksApiProjectDto
    {
        return $this->project;
    }

    public function isFavorite(): bool
    {
        return $this->favorite;
    }

    public function getTextStripped(): string
    {
        return $this->text_stripped;
    }

    public function getMilestone(): ?tasksApiMilestoneDto
    {
        return $this->milestone;
    }
}
