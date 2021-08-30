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

    public function __construct(
        int $id,
        string $name,
        int $project_id,
        string $description,
        ?string $due_date,
        bool $closed,
        ?int $daysLeft,
        ?string $text,
        ?string $color,
        tasksApiCountsDto $counts
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->project_id = $project_id;
        $this->description = $description;
        $this->due_date = $due_date;
        $this->closed = $closed;

        if ($this->due_date) {
            $this->due_info['days_left'] = $daysLeft;
            $this->due_info['text'] = $text;
            $this->due_info['color'] = $color;
        }
        $this->counts = $counts;
    }
}
