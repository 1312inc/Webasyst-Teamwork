<?php

final class tasksApiStatusResponse implements tasksApiResponseInterface
{
    /**
     * @var tasksApiStatusDto
     */
    private $status;

    /**
     * @param array<string, mixed> $status
     */
    public function __construct(array $status)
    {
        $this->status = tasksApiStatusDto::createFromArray($status);
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody(): tasksApiStatusDto
    {
        return $this->status;
    }
}
