<?php

final class tasksApiMilestoneDto implements JsonSerializable
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
     * @var int
     */
    private $project_id;

    /**
     * @var string
     */
    private $description;

    /**
     * @var string|null
     */
    private $due_date;

    /**
     * @var string[]
     */
    private $due_info = [
        'days_left' => null,
        'text' => null,
        'color' => null,
    ];

    /**
     * @var bool
     */
    private $closed;

    /**
     * tasksApiMilestoneVo constructor.
     *
     * @param int         $id
     * @param string      $name
     * @param int         $project_id
     * @param string      $description
     * @param string|null $due_date
     * @param bool        $closed
     */
    public function __construct(
        int $id,
        string $name,
        int $project_id,
        string $description,
        ?string $due_date,
        bool $closed
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->project_id = $project_id;
        $this->description = $description;
        $this->due_date = $due_date;
        $this->closed = $closed;

        if ($this->due_date) {
            $this->due_info['days_left'] = tasksHelper::calcDatesDiffInDays($this->due_date, 'today');
            $this->due_info['text'] = tasksHelper::formatDueText($this->due_info['days_left']);
            $this->due_info['color'] = tasksHelper::formatDueColor($this->due_info['days_left']);
        }
    }

    public static function fromEntity(tasksMilestone $milestone): self
    {
        return new self(
            $milestone->getId(),
            $milestone->getName(),
            $milestone->getProjectId(),
            $milestone->getDescription(),
            $milestone->getDueDate() ? $milestone->getDueDate()->format('Y-m-d') : null,
            $milestone->isClosed()
        );
    }
}
