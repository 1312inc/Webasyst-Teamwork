<?php

final class tasksApiStatusesResponse implements tasksApiResponseInterface
{
    /**
     * @var array<array<string, mixed>>
     */
    private $statuses;

    /**
     * @param array<array<string, mixed>> $statuses
     */
    public function __construct(array $statuses)
    {
        $this->statuses = array_values($statuses);
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody(): array
    {
        return [
            'total_count' => count($this->statuses),
            'data' => $this->statuses,
        ];
    }
}
