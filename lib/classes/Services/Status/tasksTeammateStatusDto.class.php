<?php

class tasksTeammateStatusDto
{
    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $bgColor = 'transparent';

    /**
     * @var string
     */
    protected $fontColor;

    /**
     * @var ?string
     */
    protected $icon;

    public function __construct(string $name, string $bgColor, string $fontColor, ?string $icon)
    {
        $this->name = $name;
        $this->bgColor = $bgColor;
        $this->fontColor = $fontColor;
        $this->icon = $icon;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getBgColor(): string
    {
        return $this->bgColor;
    }

    public function getFontColor(): string
    {
        return $this->fontColor;
    }

    public function getIcon(): ?string
    {
        return $this->icon;
    }
}
