<?php

final class tasksApiTeamInviteToTaskRequest
{
    /**
     * @var tasksValueEmail
     */
    private $email;

    /**
     * @var int
     */
    private $taskId;

    /**
     * @var int
     */
    private $accessRight;

    public function __construct(tasksValueEmail $email, int $taskId, int $accessRight)
    {
        $this->email = $email;
        $this->taskId = $taskId;
        $this->accessRight = $accessRight;
    }

    public function getEmail(): tasksValueEmail
    {
        return $this->email;
    }

    public function getTaskId(): int
    {
        return $this->taskId;
    }

    public function getAccessRight(): int
    {
        return $this->accessRight;
    }
}
