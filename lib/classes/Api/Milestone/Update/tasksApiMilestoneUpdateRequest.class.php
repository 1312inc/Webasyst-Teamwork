<?php

final class tasksApiMilestoneUpdateRequest
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $name;

    /**
     * @var ?string
     */
    private $description;

    /**
     * @var int
     */
    private $project_id;

    /**
     * @var DateTimeImmutable|null
     */
    private $due_date;

    /**
     * tasksApiMilestoneAddRequest constructor.
     *
     * @param int                    $id
     * @param string                 $name
     * @param string|null            $description
     * @param int                    $project_id
     * @param DateTimeImmutable|null $due_date
     */
    public function __construct(
        int $id,
        string $name,
        ?string $description,
        int $project_id,
        ?DateTimeImmutable $due_date
    ) {
        $this->name = $name;
        $this->description = $description;
        $this->project_id = $project_id;
        $this->due_date = $due_date;
        $this->id = $id;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function getProjectId(): int
    {
        return $this->project_id;
    }

    public function getDueDate(): ?DateTimeImmutable
    {
        return $this->due_date;
    }
}
