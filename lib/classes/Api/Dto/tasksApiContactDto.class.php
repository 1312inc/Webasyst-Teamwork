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
     * @var string|null
     */
    private $photoUrl;

    /**
     * @var bool
     */
    private $isMe;

    public function __construct(int $id, string $name, ?string $photoUrl, bool $isMe = false)
    {
        $this->id = $id;
        $this->name = $name;
        $this->photoUrl = $photoUrl;
        $this->isMe = $isMe;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getPhotoUrl(): ?string
    {
        return $this->photoUrl;
    }

    public function isMe(): bool
    {
        return $this->isMe;
    }
}
