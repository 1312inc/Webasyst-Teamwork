<?php

final class tasksApiCommentAssignRequest
{
    /**
     * @var int
     */
    private $taskId;

    /**
     * @var int
     */
    private $commentId;

    public function __construct(int $taskId, int $commentId)
    {
        $this->commentId = $commentId;
        $this->taskId = $taskId;
    }

    public function getCommentId(): int
    {
        return $this->commentId;
    }

    public function getTaskId(): int
    {
        return $this->taskId;
    }
}
