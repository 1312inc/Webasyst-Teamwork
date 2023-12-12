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

    /**
     * @var ?int
     */
    private $unread;

    public function __construct(int $task_id, bool $favorite, int $contactId, ?int $unread=null)
    {
        $this->taskId = $task_id;
        $this->favorite = $favorite;
        $this->contactId = $contactId;
        $this->unread = $unread;
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

    public function isUnread(): ?bool
    {
        return $this->unread;
    }
}
