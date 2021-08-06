<?php

final class tasksApiStatusResponse implements tasksApiResponseInterface
{
    /**
     * @var array<string, mixed>
     */
    private $status;

    /**
     * @param array<string, mixed> $status
     */
    public function __construct(array $status)
    {
        $this->status = $status;
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody(): array
    {
        return $this->status;
    }
}
