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
     * @var bool|null
     */
    private $allow_clear_assign;

    public function __construct(
        ?int $assignUser,
        ?string $buttonColor,
        ?string $titleColor,
        bool $allowComment,
        ?string $assign,
        ?bool $allowClearAssign
    ) {
        $this->assign_user = $assignUser;
        $this->button_color = $buttonColor;
        $this->title_color = $titleColor;
        $this->allow_comment = $allowComment;
        $this->assign = $assign;
        $this->allow_clear_assign = $allowClearAssign;
    }

    public static function createFromArray(array $params): tasksApiStatusParamsDto
    {
        return new self(
            !empty($params['assign_user']) ? (int) $params['assign_user'] : null,
            !empty($params['button_color']) ? $params['button_color'] : null,
            !empty($params['title_color']) ? $params['title_color'] : null,
            isset($params['allow_comment'])
                ? filter_var($params['allow_comment'], FILTER_VALIDATE_BOOLEAN)
                : false,
            !empty($params['assign']) ? $params['assign'] : null,
            isset($params['allow_clear_assign'])
                ? filter_var($params['allow_clear_assign'], FILTER_VALIDATE_BOOLEAN)
                : null
        );
    }
}
