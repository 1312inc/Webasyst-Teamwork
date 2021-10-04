<?php

final class tasksApiProjectUpdateRequest
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
     * @var string
     */
    private $icon = '';

    /**
     * @var string|null
     */
    private $icon_url;

    /**
     * @var string|null
     */
    private $color = '';

    /**
     * @var int|null
     */
    private $sort;

    /**
     * @var array|null
     */
    private $workflow;

    /**
     * @var string|null
     */
    private $icon_hash;

    public function __construct(
        int $id,
        string $name,
        ?string $icon,
        ?string $color,
        ?string $icon_url,
        int $sort,
        ?array $workflow,
        ?string $icon_hash
    ) {
        $this->name = $name;
        $this->icon = $icon ?? '';
        $this->color = $color ?? '';
        $this->sort = $sort;
        $this->icon_url = $icon_url;
        $this->workflow = $workflow;
        $this->id = $id;
        $this->icon_hash = $icon_hash;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getIcon(): string
    {
        return $this->icon;
    }

    public function getColor(): string
    {
        return $this->color;
    }

    public function getSort(): ?int
    {
        return $this->sort;
    }

    public function getIconUrl(): ?string
    {
        return $this->icon_url;
    }

    public function getWorkflow(): ?array
    {
        return $this->workflow;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getIconHash(): ?string
    {
        return $this->icon_hash;
    }
}
