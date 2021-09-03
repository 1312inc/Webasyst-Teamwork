<?php

final class tasksApiTaskDeleteRequest
{
    /**
     * @var array<int>
     */
    private $ids;

    public function __construct(array $ids)
    {
        $ids = tasksHelper::toIntArray($ids);
        $ids = tasksHelper::dropNotPositive($ids);

        $this->ids = $ids;
    }

    /**
     * @return int[]
     */
    public function getIds(): array
    {
        return $this->ids;
    }
}
