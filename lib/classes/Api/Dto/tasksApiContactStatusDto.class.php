<?php

class tasksApiContactStatusDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $bg_color;

    /**
     * @var string
     */
    protected $font_color;

    public function __construct(string $name, string $bgColor, string $fontColor)
    {
        $this->name = $name;
        $this->bg_color = $bgColor;
        $this->font_color = $fontColor;
    }
}
