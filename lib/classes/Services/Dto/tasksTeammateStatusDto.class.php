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

    public function __construct(string $name, string $bgColor, string $fontColor)
    {
        $this->name = $name;
        $this->bgColor = $bgColor;
        $this->fontColor = $fontColor;
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
}
