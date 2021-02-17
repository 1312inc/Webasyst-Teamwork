<?php

final class tasksApiResponse implements tasksApiResponseInterface
{
    /**
     * @var string
     */
    private $response;

    /**
     * @var int
     */
    private $status;

    public function __construct(int $status = self::HTTP_OK, string $response = 'ok')
    {
        $this->status = $status;
        $this->response = $response;
    }

    /**
     * @return string
     */
    public function getResponseBody(): string
    {
        return $this->response;
    }

    /**
     * @return int
     */
    public function getStatus(): int
    {
        return $this->status;
    }
}
