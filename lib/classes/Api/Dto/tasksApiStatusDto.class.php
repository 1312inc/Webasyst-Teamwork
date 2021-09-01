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
     * @var string
     */
    private $icon;

    /**
     * @var string|null
     */
    private $icon_url;

    /**
     * @var string|null
     */
    private $icon_class;

    /**
     * @var string|null
     */
    private $icon_html;

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

    /**
     * @param int                     $id
     * @param string                  $name
     * @param string                  $button
     * @param bool                    $special
     * @param string                  $icon
     * @param string|null             $icon_url
     * @param string|null             $icon_class
     * @param string|null             $icon_html
     * @param int                     $sort
     * @param tasksApiStatusParamsDto $params
     */
    public function __construct(
        int $id,
        string $name,
        string $button,
        bool $special,
        string $icon,
        ?string $icon_url,
        ?string $icon_class,
        ?string $icon_html,
        int $sort,
        tasksApiStatusParamsDto $params,
        tasksApiCountsDto $counts
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->button = $button;
        $this->special = $special;
        $this->icon = $icon;
        $this->icon_url = $icon_url;
        $this->icon_class = $icon_class;
        $this->icon_html = $icon_html;
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

    public function getIcon(): string
    {
        return $this->icon;
    }

    public function getIconUrl(): ?string
    {
        return $this->icon_url;
    }

    public function getIconClass(): ?string
    {
        return $this->icon_class;
    }

    public function getIconHtml(): ?string
    {
        return $this->icon_html;
    }

    public function getSort(): int
    {
        return $this->sort;
    }

    public function getParams(): tasksApiStatusParamsDto
    {
        return $this->params;
    }
}
