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
     * tasksApiTaskDto constructor.
     *
     * @param int                     $id
     * @param string                  $name
     * @param string                  $text
     * @param tasksApiContactDto      $create_contact
     * @param tasksApiContactDto|null $visavis_contact
     * @param string                  $create_datetime
     * @param string|null             $update_datetime
     * @param tasksApiContactDto|null $assigned_contact
     * @param int                     $project_id
     * @param int|null                $milestone_id
     * @param int                     $number
     * @param int                     $status_id
     * @param int|null                $parent_id
     * @param int                     $priority
     * @param int|null                $assign_log_id
     * @param int|null                $comment_log_id
     * @param int|null                $contact_id
     * @param int                     $hidden_timestamp
     * @param string|null             $due_date
     * @param tasksApiAttachmentDto[] $all_attachments
     * @param tasksApiLogDto[]        $log
     * @param tasksApiTagDto[]        $tags
     * @param tasksApiProjectDto|null $project
     */
    public function __construct(
        int $id,
        string $name,
        string $text,
        tasksApiContactDto $create_contact,
        ?tasksApiContactDto $visavis_contact,
        string $create_datetime,
        ?string $update_datetime,
        ?tasksApiContactDto $assigned_contact,
        int $project_id,
        ?int $milestone_id,
        int $number,
        int $status_id,
        ?int $parent_id,
        int $priority,
        ?int $assign_log_id,
        ?int $comment_log_id,
        ?int $contact_id,
        int $hidden_timestamp,
        ?string $due_date,
        array $all_attachments,
        array $log,
        array $tags,
        ?tasksApiProjectDto $project
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->text = $text;
        $this->create_contact = $create_contact;
        $this->create_datetime = $create_datetime;
        $this->update_datetime = $update_datetime;
        $this->assigned_contact = $assigned_contact;
        $this->project_id = $project_id;
        $this->milestone_id = $milestone_id;
        $this->number = $number;
        $this->status_id = $status_id;
        $this->parent_id = $parent_id;
        $this->priority = $priority;
        $this->assign_log_id = $assign_log_id;
        $this->comment_log_id = $comment_log_id;
        $this->contact_id = $contact_id;
        $this->hidden_timestamp = $hidden_timestamp;
        $this->due_date = $due_date;
        $this->attachments = $all_attachments;
        $this->log = $log;
        $this->tags = $tags;
        $this->project = $project;
        $this->visavis_contact = $visavis_contact;
    }
}
