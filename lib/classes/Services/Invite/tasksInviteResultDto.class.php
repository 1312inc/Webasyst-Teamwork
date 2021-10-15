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

    public function __construct(?int $contactId, ?string $errorDescription)
    {
        $this->contactId = $contactId;
        $this->errorDescription = $errorDescription;
    }

    public function getContactId(): ?int
    {
        return $this->contactId;
    }

    public function getErrorDescription(): ?string
    {
        return $this->errorDescription;
    }
}
