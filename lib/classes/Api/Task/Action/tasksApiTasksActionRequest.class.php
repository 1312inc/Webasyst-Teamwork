<?php

final class tasksApiTasksActionRequest
{
    public const ACTION_TYPE_CLOSE = 'close';

    public const ALLOWED_ACTION = [
        tasksTaskLogModel::ACTION_TYPE_EMPTY,
        tasksTaskLogModel::ACTION_TYPE_RETURN,
        tasksTaskLogModel::ACTION_TYPE_FORWARD,
        self::ACTION_TYPE_CLOSE,
    ];

    /**
     * @var int
     */
    private $taskId;

    /**
     * @var string
     */
    private $action;

    /**
     * @var string|null
     */
    private $text;

    /**
     * @var string|null
     */
    private $filesHash;

    /**
     * @var int|null
     */
    private $assignedContactId;

    /**
     * @var int|null
     */
    private $statusId;

    public function __construct(
        int $taskId,
        string $action,
        ?string $text,
        ?string $filesHash,
        ?int $assignedContactId,
        ?int $statusId
    ) {
        $this->taskId = $taskId;
        $this->action = $action;
        $this->text = $text;
        $this->filesHash = $filesHash;
        $this->assignedContactId = $assignedContactId;
        $this->statusId = $statusId;
    }

    public function getTaskId(): int
    {
        return $this->taskId;
    }

    public function getAction(): string
    {
        return $this->action;
    }

    public function getText(): ?string
    {
        return $this->text;
    }

    public function getFilesHash(): ?string
    {
        return $this->filesHash;
    }

    public function getAssignedContactId(): ?int
    {
        return $this->assignedContactId;
    }

    public function getStatusId(): ?int
    {
        return $this->statusId;
    }
}
