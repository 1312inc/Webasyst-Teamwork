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
        $this->status = tasksApiStatusDtoFactory::createFromArray(
            $status,
            tasksApiCountsDtoFactory::createForStatusId($status['id'])
        );
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
