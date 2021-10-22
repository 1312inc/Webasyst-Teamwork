<?php

final class tasksApiTasksFavoriteRequest
{
    /**
     * @var int
     */
    private $taskId;
    /**
     * @var bool
     */
    private $favorite;

    /**
     * @var int
     */
    private $contactId;

    public function __construct(int $task_id, bool $favorite, int $contactId)
    {
        $this->taskId = $task_id;
        $this->favorite = $favorite;
        $this->contactId = $contactId;
    }

    public function getTaskId(): int
    {
        return $this->taskId;
    }

    public function isFavorite(): bool
    {
        return $this->favorite;
    }

    public function getContactId(): int
    {
        return $this->contactId;
    }
}
