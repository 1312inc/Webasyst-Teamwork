<?php

final class tasksApiMilestoneAddRequest
{
    /**
     * @var string
     */
    private $name;

    /**
     * @var string
     */
    private $description;

    /**
     * @var int
     */
    private $projectId;

    /**
     * @var DateTimeImmutable|null
     */
    private $dueDate;

    public function __construct(string $name, string $description, int $projectId, ?DateTimeImmutable $dueDate)
    {
        $this->name = $name;
        $this->description = $description;
        $this->projectId = $projectId;
        $this->dueDate = $dueDate;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getProjectId(): int
    {
        return $this->projectId;
    }

    public function getDueDate(): ?DateTimeImmutable
    {
        return $this->dueDate;
    }
}
