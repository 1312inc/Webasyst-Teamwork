<?php

final class tasksApiPushDisableRequest
{
    /**
     * @var string
     */
    private $clientId;

    public function __construct(string $clientId)
    {
        $this->clientId = $clientId;
    }

    public function getClientId(): string
    {
        return $this->clientId;
    }
}
