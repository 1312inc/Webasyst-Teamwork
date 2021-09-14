<?php

final class tasksApiStatusDto implements JsonSerializable
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
    private $button;

    /**
     * @var bool
     */
    private $special;

    /**
     * @var int
     */
    private $sort;

    /**
     * @var tasksApiStatusParamsDto
     */
    private $params;

    /**
     * @var tasksApiCountsDto
     */
    private $counts;

    public function __construct(
        int $id,
        string $name,
        string $button,
        bool $special,
        int $sort,
        tasksApiStatusParamsDto $params,
        tasksApiCountsDto $counts
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->button = $button;
        $this->special = $special;
        $this->sort = $sort;
        $this->params = $params;
        $this->counts = $counts;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getButton(): string
    {
        return $this->button;
    }

    public function isSpecial(): bool
    {
        return $this->special;
    }

    public function getSort(): int
    {
        return $this->sort;
    }

    public function getParams(): tasksApiStatusParamsDto
    {
        return $this->params;
    }

    public function getCounts(): tasksApiCountsDto
    {
        return $this->counts;
    }
}
