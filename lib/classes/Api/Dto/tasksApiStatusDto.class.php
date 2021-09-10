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

    public function __construct(
        int $id,
        string $name,
        string $button,
        bool $special,
        string $icon,
        ?string $iconUrl,
        ?string $iconClass,
        ?string $iconHtml,
        int $sort,
        tasksApiStatusParamsDto $params,
        tasksApiCountsDto $counts
    ) {
        $this->id = $id;
        $this->name = $name;
        $this->button = $button;
        $this->special = $special;
        $this->icon = $icon;
        $this->icon_url = $iconUrl;
        $this->icon_class = $iconClass;
        $this->icon_html = $iconHtml;
        $this->sort = $sort;
        $this->params = $params;
        $this->counts = $counts;
    }
}
