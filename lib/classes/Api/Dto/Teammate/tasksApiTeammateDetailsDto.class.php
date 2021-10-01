<?php

final class tasksApiTeammateDetailsDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var tasksApiContactDto
     */
    private $contact;

    /**
     * @var tasksApiTeammateContactInfoDto
     */
    private $contact_info;

    /**
     * @var tasksApiContactStatusDto|null
     */
    private $status;

    /**
     * @var tasksApiLogDto|null
     */
    private $last_log;

    /**
     * @var array
     */
    private $groups;

    public function __construct(
        tasksApiContactDto $contactDto,
        tasksApiTeammateContactInfoDto $contactInfoDto,
        ?tasksApiContactStatusDto $contactStatusDto,
        ?tasksApiLogDto $logDto,
        array $groups
    ) {
        $this->contact = $contactDto;
        $this->contact_info = $contactInfoDto;
        $this->status = $contactStatusDto;
        $this->last_log = $logDto;
        $this->groups = $groups;
    }

    public function getLastLog(): ?tasksApiLogDto
    {
        return $this->last_log;
    }
}
