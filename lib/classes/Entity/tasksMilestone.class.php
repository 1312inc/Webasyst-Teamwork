<?php

class tasksMilestone implements tasksPersistableInterface
{
    /**
     * @var int|null
     */
    private $id;

    /**
     * @var string
     */
    private $name;

    /**
     * @var string
     */
    private $description = '';

    /**
     * @var int
     */
    private $project_id;

    /**
     * @var DateTimeImmutable|null
     */
    private $due_date;

    /**
     * @var bool
     */
    private $closed = false;

    /**
     * @var tasksProject
     */
    private $project;

    /**
     * @var float
     */
    private $closed_percent = 0.;

    /**
     * @return int|null
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int|null $id
     *
     * @return tasksMilestone
     */
    public function setId($id): tasksMilestone
    {
        $this->id = $id;

        return $this;
    }

    /**
     * @return string
     */
    public function getName(): string
    {
        return $this->name;
    }

    /**
     * @param string $name
     *
     * @return tasksMilestone
     */
    public function setName(string $name): tasksMilestone
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getDescription(): string
    {
        return $this->description;
    }

    /**
     * @param string $description
     *
     * @return tasksMilestone
     */
    public function setDescription(string $description): tasksMilestone
    {
        $this->description = $description;

        return $this;
    }

    /**
     * @return int
     */
    public function getProjectId(): int
    {
        return $this->project_id;
    }

    /**
     * @param int $project_id
     *
     * @return tasksMilestone
     */
    public function setProjectId(int $project_id): tasksMilestone
    {
        $this->project_id = $project_id;

        return $this;
    }

    /**
     * @return DateTimeImmutable|null
     */
    public function getDueDate(): ?DateTimeImmutable
    {
        return $this->due_date;
    }

    /**
     * @param DateTimeImmutable|null $due_date
     *
     * @return tasksMilestone
     */
    public function setDueDate(?DateTimeImmutable $due_date): tasksMilestone
    {
        $this->due_date = $due_date;

        return $this;
    }

    /**
     * @return bool
     */
    public function isClosed(): bool
    {
        return $this->closed;
    }

    /**
     * @param bool $closed
     *
     * @return tasksMilestone
     */
    public function setClosed(bool $closed): tasksMilestone
    {
        $this->closed = $closed;

        return $this;
    }

    public function convertToSqlValues(array $fields): array
    {
        $converted = [];

        if ($this->due_date) {
            $converted['due_date'] = $this->due_date->format('Y-m-d');
        }

        return $converted;
    }

    public function convertToPhpValues(array &$dbValues): void
    {
        $dbValues['id'] = (int) $dbValues['id'];
        $dbValues['project_id'] = (int) $dbValues['project_id'];
        $dbValues['closed'] = (bool) $dbValues['closed'];

        if (!empty($dbValues['due_date'])) {
            $dbValues['due_date'] = DateTimeImmutable::createFromFormat('Y-m-d|', $dbValues['due_date']);
        }
    }

    /**
     * @return tasksProject
     */
    public function getProject(): tasksProject
    {
        return $this->project;
    }

    /**
     * @param tasksProject $project
     *
     * @return tasksMilestone
     */
    public function setProject(tasksProject $project): tasksMilestone
    {
        $this->project = $project;

        return $this;
    }

    /**
     * @return int
     */
    public function getClosedPercent(): int
    {
        return $this->closed_percent;
    }

    /**
     * @param float  $closed_percent
     *
     * @return tasksMilestone
     */
    public function setClosedPercent(float $closed_percent): tasksMilestone
    {
        $this->closed_percent = $closed_percent;

        return $this;
    }
}
