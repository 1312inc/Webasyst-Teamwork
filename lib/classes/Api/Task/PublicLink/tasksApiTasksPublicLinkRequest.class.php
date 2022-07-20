<?php

final class tasksApiTasksPublicLinkRequest
{
    /**
     * @var int
     */
    private $id;

    /**
     * @var bool
     */
    private $publish;

    public function __construct(int $id, bool $publish)
    {
        $this->publish = $publish;
        $this->id = $id;
    }

    public function isPublish(): bool
    {
        return $this->publish;
    }

    public function getId(): int
    {
        return $this->id;
    }
}
