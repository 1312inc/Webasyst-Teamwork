<?php

class tasksApiMySettingsDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var int
     */
    private $id;

    /**
     * @var tasksApiContactRightsDto
     */
    private $rights;

    /**
     * @var string|null
     */
    private $timezone;

    /**
     * @var int
     */
    private $ts;

    public function __construct(int $id, tasksApiContactRightsDto $rights, ?string $timezone)
    {
        $this->id = $id;
        $this->rights = $rights;
        $this->timezone = $timezone;
        $this->ts = time();
    }

    public static function createFromContact(waContact $contact): self
    {
        $rights = $contact->getRights(tasksConfig::APP_ID);

        return new self((int) $contact->getId(), new tasksApiContactRightsDto($rights), $contact->getTimezone());
    }
}
