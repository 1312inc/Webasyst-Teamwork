<?php

final class tasksApiTeamInviteToTaskRequest
{
    /**
     * @var tasksValueEmail|null
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

    /**
     * @var tasksValuePhone|null
     */
    private $phone;

    public function __construct(?tasksValueEmail $email,?tasksValuePhone $phone, int $taskId, int $accessRight)
    {
        if ($email === null && $phone === null) {
            throw new tasksApiWrongParamException('phone, email', 'Phone or email are required');
        }

        $this->email = $email;
        $this->taskId = $taskId;
        $this->accessRight = $accessRight;
        $this->phone = $phone;
    }

    public function getEmail(): ?tasksValueEmail
    {
        return $this->email;
    }

    public function getPhone(): ?tasksValuePhone
    {
        return $this->phone;
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
