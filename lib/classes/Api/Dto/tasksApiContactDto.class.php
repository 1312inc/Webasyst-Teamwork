<?php

final class tasksApiContactDto implements JsonSerializable
{
    use tasksApiJsonSerializableTrait;

    /**
     * @var int
     */
    private $id;

    /**
     * @var string
     */
    private $name;

    /**
     * tasksApiContactVo constructor.
     *
     * @param int    $id
     * @param string $name
     */
    public function __construct(int $id, string $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    public static function fromContactId(int $contactId): self
    {
        return self::fromContact(new waContact($contactId));
    }

    public static function fromContact(waContact $contact): self
    {
        return new self((int) $contact->getId(), $contact->getName());
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }
}
