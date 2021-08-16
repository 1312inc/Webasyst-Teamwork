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

    public function __construct(
        int $id,
        string $name,
        int $project_id,
        string $description,
        ?string $due_date,
        bool $closed,
        ?int $daysLeft = null,
        ?string $text = null,
        ?string $color = null
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
    }

    public static function fromEntity(tasksMilestone $milestone): self
    {
        $daysLeft = null;
        $text = null;
        $color = null;
        $dueDate = null;
        if ($milestone->getDueDate()) {
            $dueDate = $milestone->getDueDate()->format('Y-m-d');
            $daysLeft = tasksHelper::calcDatesDiffInDays($dueDate, 'today');
            $text = tasksHelper::formatDueText($daysLeft);
            $color = tasksHelper::formatDueColor($daysLeft);
        }

        return new self(
            $milestone->getId(),
            $milestone->getName(),
            $milestone->getProjectId(),
            $milestone->getDescription(),
            $dueDate,
            $milestone->isClosed(),
            $daysLeft,
            $text,
            $color
        );
    }

    public static function fromArray(array $data): self
    {
        return new self(
            (int) $data['id'],
            $data['name'] ?? '',
            (int) $data['project_id'],
            $data['description'] ?? '',
            !empty($data['due_date']) ? $data['due_date'] : null,
            isset($data['closed']) ? filter_var($data['closed'], FILTER_VALIDATE_BOOLEAN) : false,
            (int) $data['days_left'],
            $data['view']['due_text'] ?? null,
            $data['due_color_class'] ?? null
        );
    }
}
