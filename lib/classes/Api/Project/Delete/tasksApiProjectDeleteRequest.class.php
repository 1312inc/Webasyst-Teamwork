<?php

final class tasksApiProjectDeleteRequest
{
    /**
     * @var int
     */
    private $id;

    /**
     * tasksApiProjectDeleteRequest constructor.
     *
     * @param int $id
     */
    public function __construct(int $id) {
        $this->id = $id;
    }

    public function getId(): int
    {
        return $this->id;
    }
}
