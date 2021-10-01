<?php

final class tasksApiTeammateDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var tasksApiContactDto
     */
    private $contact;

    /**
     * @var tasksApiContactStatusDto|null
     */
    private $status;

    public function __construct(tasksApiContactDto $contactDto, ?tasksApiContactStatusDto $contactStatusDto)
    {
        $this->contact = $contactDto;
        $this->status = $contactStatusDto;
    }
}
