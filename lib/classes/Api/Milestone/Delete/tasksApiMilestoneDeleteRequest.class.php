<?php

final class tasksApiMilestoneDeleteRequest
{
    /**
     * @var int
     */
    private $id;

    /**
     * tasksApiMilestoneDeleteRequest constructor.
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
