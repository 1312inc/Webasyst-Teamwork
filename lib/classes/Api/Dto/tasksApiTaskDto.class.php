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
     * @var tasksApiContactDto
     */
    private $create_contact;

    /**
     * @var tasksApiContactDto|null
     */
    private $visavis_contact;

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

    public function __construct(
        int $id,
        string $name,
        string $text,
        tasksApiContactDto $createContact,
        ?tasksApiContactDto $visavisContact,
        string $createDatetime,
        ?string $updateDatetime,
        ?tasksApiContactDto $assignedContact,
        int $projectId,
        ?int $milestoneId,
        int $number,
        int $statusId,
        ?int $nextStatusId,
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
        ?tasksApiProjectDto $project
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->text = $text;
        $this->create_contact = $createContact;
        $this->create_datetime = $createDatetime;
        $this->update_datetime = $updateDatetime;
        $this->assigned_contact = $assignedContact;
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
    }
}
