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

    /**
     * @var tasksApiCountsDto
     */
    private $counts;

    /**
     * @var int
     */
    private $sort;

    /**
     * @var string|null
     */
    private $inviteLink;

    public function __construct(
        tasksApiContactDto $contactDto,
        tasksApiTeammateContactInfoDto $contactInfoDto,
        ?tasksApiContactStatusDto $contactStatusDto,
        ?tasksApiLogDto $logDto,
        array $groups,
        tasksApiCountsDto $counts,
        int $sort = 0,
        ?string $inviteLink = null
    ) {
        $this->contact = $contactDto;
        $this->contact_info = $contactInfoDto;
        $this->status = $contactStatusDto;
        $this->last_log = $logDto;
        $this->groups = $groups;
        $this->counts = $counts;
        $this->sort = $sort;
        $this->inviteLink = $inviteLink;
    }

    public function getLastLog(): ?tasksApiLogDto
    {
        return $this->last_log;
    }

    public function setSort(int $sort): tasksApiTeammateDetailsDto
    {
        $this->sort = $sort;

        return $this;
    }

    public function getGroups(): array
    {
        return $this->groups;
    }
}
