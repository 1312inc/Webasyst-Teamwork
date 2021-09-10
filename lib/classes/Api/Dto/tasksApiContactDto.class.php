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
    private $photo_url;

    /**
     * @var bool
     */
    private $is_me;

    public function __construct(int $id, string $name, ?string $photoUrl, bool $isMe = false)
    {
        $this->id = $id;
        $this->name = $name;
        $this->photo_url = $photoUrl;
        $this->is_me = $isMe;
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
        return $this->photo_url;
    }

    public function isMe(): bool
    {
        return $this->is_me;
    }
}
