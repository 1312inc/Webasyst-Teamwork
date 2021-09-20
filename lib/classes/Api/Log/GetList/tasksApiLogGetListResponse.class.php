<?php

final class tasksApiLogGetListResponse implements tasksApiResponseInterface
{
    /**
     * @var tasksApiLogGetListDto
     */
    private $dto;

    /**
     * @param tasksApiLogGetListDto $dto
     */
    public function __construct(tasksApiLogGetListDto $dto)
    {
        $this->dto = $dto;
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody()
    {
        return [
            'total_count' => $this->dto->getTotal(),
            'count' => $this->dto->getCount(),
            'data' => [
                'log' => array_map(
                    static function ($log) {
                        return tasksApiLogDtoFactory::createFromArray($log);
                    },
                    $this->dto->getLogs()
                ),
                'log_grouped' => array_reduce(
                    $this->dto->groupLogsByDates(),
                    static function ($logs, $log) {
                        $logs[] = [
                            'group' => $log['group'],
                            'date' => $log['date'],
                            'items' => array_map(
                                static function ($log) {
                                    return tasksApiLogDtoFactory::createFromArray($log);
                                },
                                $log['items']
                            ),
                        ];

                        return $logs;
                    },
                    []
                ),
            ],
        ];
    }
}
