<?php

class tasksApiLogDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var int
     */
    protected $id;

    /**
     * @var ?int
     */
    protected $project_id;

    /**
     * @var int
     */
    protected $task_id;

    /**
     * @var tasksApiContactDto
     */
    protected $contact;

    /**
     * @var string
     */
    protected $text;

    /**
     * @var string
     */
    protected $create_datetime;

    /**
     * @var int|null
     */
    protected $before_status_id;

    /**
     * @var int|null
     */
    protected $after_status_id;

    /**
     * @var string
     */
    protected $action;

    /**
     * @var tasksApiContactDto|null
     */
    protected $assigned_contact;

    /**
     * @var bool
     */
    protected $status_changed;

    /**
     * @var bool
     */
    protected $assignment_changed;

    public function __construct(
        int $id,
        ?int $project_id,
        int $task_id,
        tasksApiContactDto $contact,
        string $text,
        string $create_datetime,
        ?int $before_status_id,
        ?int $after_status_id,
        string $action,
        ?tasksApiContactDto $assigned_contact,
        bool $status_changed,
        bool $assignment_changed
    ) {
        $this->id = $id;
        $this->project_id = $project_id;
        $this->task_id = $task_id;
        $this->contact = $contact;
        $this->text = $text;
        $this->create_datetime = $create_datetime;
        $this->before_status_id = $before_status_id;
        $this->after_status_id = $after_status_id;
        $this->action = $action;
        $this->assigned_contact = $assigned_contact;
        $this->status_changed = $status_changed;
        $this->assignment_changed = $assignment_changed;
    }
}
