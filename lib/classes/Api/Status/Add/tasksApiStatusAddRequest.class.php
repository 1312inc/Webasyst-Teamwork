<?php

class tasksApiStatusAddRequest
{
    /**
     * @var string
     */
    protected $name;

    /**
     * @var string
     */
    protected $button;

    /**
     * @var string
     */
    protected $icon;

    /**
     * @var null|int
     */
    protected $assignUser;

    /**
     * @var null|string
     */
    protected $assign;

    /**
     * @var boolean|null
     */
    protected $allowClearAssign;

    /**
     * @var string|null
     */
    protected $buttonColor;

    /**
     * @var string|null
     */
    protected $titleColor;

    /**
     * @var boolean|null
     */
    protected $allowComment = null;

    /**
     * @var int
     */
    protected $sort;

    public function __construct(
        string $name,
        string $button,
        string $icon,
        ?int $assignUser,
        ?string $assign,
        ?bool $allowClearAssign,
        ?string $buttonColor,
        ?string $titleColor,
        ?bool $allowComment,
        int $sort
    ) {
        $this->name = $name;
        $this->button = $button;
        $this->icon = $icon;
        $this->assignUser = $assignUser;
        $this->assign = $assign ?: tasksStatusParamsModel::ASSIGN_TYPE_NO_CHANGE;
        $this->allowClearAssign = $allowClearAssign;
        $this->buttonColor = $buttonColor;
        $this->titleColor = $titleColor;
        $this->allowComment = $allowComment;
        $this->sort = $sort;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getButton(): string
    {
        return $this->button;
    }

    public function getIcon(): string
    {
        return $this->icon;
    }

    public function getSort(): int
    {
        return $this->sort;
    }

    public function getAssignUser(): ?int
    {
        return $this->assignUser;
    }

    public function getAssign(): ?string
    {
        return $this->assign;
    }

    public function getAllowClearAssign(): ?bool
    {
        return $this->allowClearAssign;
    }

    public function getButtonColor(): ?string
    {
        return $this->buttonColor;
    }

    public function getTitleColor(): ?string
    {
        return $this->titleColor;
    }

    public function getAllowComment(): ?bool
    {
        return $this->allowComment;
    }
}
