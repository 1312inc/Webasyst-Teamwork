<?php

class tasksStatus implements tasksPersistableInterface
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
    private $button = '';

    /**
     * @var string
     */
    private $icon = '';

    /**
     * @var int
     */
    private $sort;

    /**
     * @var array<string, mixed>
     */
    private $tasksStatusParams = [];

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @param int|null $id
     *
     * @return tasksStatus
     */
    public function setId(?int $id): tasksStatus
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
     * @return tasksStatus
     */
    public function setName(string $name): tasksStatus
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getButton(): string
    {
        return $this->button;
    }

    /**
     * @param string $button
     *
     * @return tasksStatus
     */
    public function setButton(string $button): tasksStatus
    {
        $this->button = $button;

        return $this;
    }

    /**
     * @return string
     */
    public function getIcon(): string
    {
        return $this->icon;
    }

    /**
     * @param string $icon
     *
     * @return tasksStatus
     */
    public function setIcon(string $icon): tasksStatus
    {
        $this->icon = $icon;

        return $this;
    }

    /**
     * @return int
     */
    public function getSort(): int
    {
        return $this->sort;
    }

    /**
     * @param int $sort
     *
     * @return tasksStatus
     */
    public function setSort(int $sort): tasksStatus
    {
        $this->sort = $sort;

        return $this;
    }

    /**
     * @return array<string, mixed>
     */
    public function getTasksStatusParams(): array
    {
        return $this->tasksStatusParams;
    }

    /**
     * @param array<string, mixed> $tasksStatusParams
     *
     * @return tasksStatus
     */
    public function setTasksStatusParams(array $tasksStatusParams): tasksStatus
    {
        $this->tasksStatusParams = $tasksStatusParams;

        return $this;
    }

    public function convertToSqlValues(array $fields): array
    {
        // TODO: Implement convertToSqlValues() method.
    }

    public function convertToPhpValues(array &$dbValues): void
    {
        // TODO: Implement convertToPhpValues() method.
    }
}
