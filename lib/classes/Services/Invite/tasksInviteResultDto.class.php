<?php

class tasksInviteResultDto
{
    /**
     * @var int|null
     */
    private $contactId;

    /**
     * @var string|null
     */
    private $errorDescription;

    /**
     * @var array|null
     */
    private $token;

    public function __construct(?int $contactId, ?string $errorDescription, ?array $token)
    {
        $this->contactId = $contactId;
        $this->errorDescription = $errorDescription;
        $this->token = $token;
    }

    public function getContactId(): ?int
    {
        return $this->contactId;
    }

    public function getErrorDescription(): ?string
    {
        return $this->errorDescription;
    }

    public function getToken(): ?array
    {
        return $this->token;
    }
}
