<?php

final class tasksApiStatusParamsDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var int|null
     */
    private $assign_user;

    /**
     * @var string|null
     */
    private $button_color;

    /**
     * @var string|null
     */
    private $title_color;

    /**
     * @var bool
     */
    private $allow_comment = false;

    /**
     * @var string|null
     */
    private $assign;

    /**
     * @param int|null $assign_user
     * @param string|null $button_color
     * @param string|null $title_color
     * @param bool $allow_comment
     * @param string|null $assign
     */
    public function __construct(
        ?int $assign_user,
        ?string $button_color,
        ?string $title_color,
        bool $allow_comment,
        ?string $assign
    ) {
        $this->assign_user = $assign_user;
        $this->button_color = $button_color;
        $this->title_color = $title_color;
        $this->allow_comment = $allow_comment;
        $this->assign = $assign;
    }

    public static function createFromArray(array $params): tasksApiStatusParamsDto
    {
        return new self(
            !empty($params['assign_user']) ? (int) $params['assign_user'] : null,
            !empty($params['button_color']) ? $params['button_color'] : null,
            !empty($params['title_color']) ? $params['title_color'] : null,
            !empty($params['allow_comment']) ? filter_var($params['allow_comment'], FILTER_VALIDATE_BOOLEAN) : false,
            !empty($params['assign']) ? $params['assign'] : null
        );
    }

    public function getAssignUser(): ?int
    {
        return $this->assign_user;
    }

    public function getButtonColor(): ?string
    {
        return $this->button_color;
    }

    public function getTitleColor(): ?string
    {
        return $this->title_color;
    }

    public function isAllowComment(): bool
    {
        return $this->allow_comment;
    }

    public function getAssign(): ?string
    {
        return $this->assign;
    }
}
