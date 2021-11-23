<?php

final class tasksApiStatusUpdateRequest extends tasksApiStatusAddRequest
{
    /**
     * @var int
     */
    private $id;

    public function __construct(
        int $id,
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
        parent::__construct(
            $name,
            $button,
            $icon,
            $assignUser,
            $assign ?: tasksStatusParamsModel::ASSIGN_TYPE_NO_CHANGE,
            $allowClearAssign,
            $buttonColor,
            $titleColor,
            $allowComment,
            $sort
        );

        $this->id = $id;
    }

    public function getId(): int
    {
        return $this->id;
    }
}
