<?php

final class tasksApiStatusAddRequest
{
    /**
     * @var string
     */
    private $name;

    /**
     * @var string
     */
    private $button;

    /**
     * @var string
     */
    private $icon;

    /**
     * @var null|int
     */
    private $assignUser;

    /**
     * @var null|string
     */
    private $assign;

    /**
     * @var boolean|null
     */
    private $allowClearAssign;

    /**
     * @var string|null
     */
    private $buttonColor;

    /**
     * @var string|null
     */
    private $titleColor;

    /**
     * @var boolean|null
     */
    private $allowComment = null;

    /**
     * @var int
     */
    private $sort;

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
