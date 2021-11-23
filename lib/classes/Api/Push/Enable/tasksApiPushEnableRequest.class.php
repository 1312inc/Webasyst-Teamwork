<?php

final class tasksApiPushEnableRequest
{
    /**
     * @var string
     */
    private $clientId;

    /**
     * @var string|null
     */
    private $accessToken;

    /**
     * @var waContact
     */
    private $contact;

    public function __construct(string $clientId, ?string $accessToken, waContact $contact)
    {
        $this->clientId = $clientId;
        $this->accessToken = $accessToken;
        $this->contact = $contact;
    }

    public function getClientId(): string
    {
        return $this->clientId;
    }

    public function getAccessToken(): ?string
    {
        return $this->accessToken;
    }

    public function getContact(): waContact
    {
        return $this->contact;
    }
}
