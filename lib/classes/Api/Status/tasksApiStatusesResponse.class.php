<?php

final class tasksApiStatusesResponse implements tasksApiResponseInterface
{
    /**
     * @var array<tasksApiStatusDto>
     */
    private $statuses;

    /**
     * @param array<array<string, mixed>> $statuses
     */
    public function __construct(array $statuses)
    {
        foreach ($statuses as $status) {
            $this->statuses[] = tasksApiStatusDto::createFromArray($status);
        }
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
