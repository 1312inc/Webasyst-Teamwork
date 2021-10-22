<?php

final class tasksApiAttachmentDeleteRequest
{
    /**
     * @var array<int>
     */
    private $ids;

    public function __construct(array $ids)
    {
        $this->ids = $ids;
    }

    /**
     * @return array<int>
     */
    public function getIds(): array
    {
        return $this->ids;
    }
}
