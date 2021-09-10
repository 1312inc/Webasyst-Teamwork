<?php

/**
 * Class tasksApiErrorResponse
 */
class tasksApiErrorResponse implements tasksApiResponseInterface, JsonSerializable
{
    /**
     * @var string
     */
    private $error;

    /**
     * @var string
     */
    private $errorMessage;

    /**
     * @var null|string
     */
    private $trace;

    /**
     * @var int
     */
    private $status;

    /**
     * tasksApiErrorResponse constructor.
     *
     * @param string $errorMessage
     * @param string $error
     * @param int    $status
     */
    public function __construct($errorMessage, $error = tasksApiResponseInterface::RESPONSE_FAIL, $status = 400)
    {
        $this->errorMessage = $errorMessage;
        $this->error = $error;
        $this->status = $status;
    }

    /**
     * @param Throwable $ex
     *
     * @return tasksApiErrorResponse
     */
    public static function fromException(Throwable $ex): tasksApiErrorResponse
    {
        $response = new self($ex->getMessage(), 'error', $ex->getCode());
        $response->trace = $ex->getTrace();

        return $response;
    }

    /**
     * @return array
     */
    public function jsonSerialize(): array
    {
        $data = [
            'error' => $this->error,
            'error_message' => $this->errorMessage,
        ];

        if ($this->trace && waSystemConfig::isDebug()) {
            $data['trace'] = $this->trace;
        }

        return $data;
    }

    /**
     * @return $this
     */
    public function getResponseBody(): tasksApiErrorResponse
    {
        return $this;
    }

    /**
     * @return int
     */
    public function getStatus(): int
    {
        return (int) $this->status;
    }
}
