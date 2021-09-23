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
            'data' => array_map(
                static function ($log) {
                    return tasksApiLogDtoFactory::createFromArray($log);
                },
                $this->dto->getLogs()
            ),
        ];
    }
}
