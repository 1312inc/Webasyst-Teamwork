<?php

final class tasksApiTagGetListResponse implements tasksApiResponseInterface
{
    /**
     * @var array<tasksApiTagDto>
     */
    private $dtos;

    /**
     * @param array<array<string, mixed>> $tags
     */
    public function __construct(array $tags)
    {
        $this->dtos = [];
        foreach ($tags as $tag) {
            $this->dtos[] = tasksApiTagDtoFactory::create($tag);
        }
    }

    public function getStatus(): int
    {
        return self::HTTP_OK;
    }

    public function getResponseBody()
    {
        return [
            'total_count' => count($this->dtos),
            'data' => $this->dtos,
        ];
    }
}
