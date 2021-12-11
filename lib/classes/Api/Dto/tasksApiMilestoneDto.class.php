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
     * @var tasksApiCountsDto
     */
    private $counts;

    /**
     * @var null|int
     */
    private $sort;

    public function __construct(
        int $id,
        string $name,
        int $projectId,
        string $description,
        ?string $dueDate,
        bool $closed,
        ?int $daysLeft,
        ?string $text,
        ?string $color,
        tasksApiCountsDto $counts,
        ?int $sort
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->project_id = $projectId;
        $this->description = $description;
        $this->due_date = $dueDate;
        $this->closed = $closed;

        if ($this->due_date) {
            $this->due_info['days_left'] = $daysLeft;
            $this->due_info['text'] = $text;
            $this->due_info['color'] = $color;
        }
        $this->counts = $counts;
        $this->sort = $sort;
    }
}
