<?php

final class tasksApiResponse implements tasksApiResponseInterface
{
    /**
     * @var mixed
     */
    private $response;

    /**
     * @var int
     */
    private $status;

    public function __construct(int $status = self::HTTP_OK, $response = tasksApiResponseInterface::RESPONSE_OK)
    {
        $this->status = $status;
        $this->response = $response;
    }

    /**
     * @return mixed
     */
    public function getResponseBody()
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
