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

    public function __construct(int $id, string $name, ?string $photoUrl)
    {
        $this->id = $id;
        $this->name = $name;
        $this->photoUrl = $photoUrl;
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
}
