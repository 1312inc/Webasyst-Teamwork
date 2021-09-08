<?php

final class tasksUserTasksCountPairDto
{
    /**
     * "красные"
     *
     * @var int
     */
    private $countRed;

    /**
     * все незакрытые
     *
     * @var int
     */
    private $total;

    public function __construct(int $countRed, int $total)
    {
        $this->countRed = $countRed;
        $this->total = $total;
    }

    public function getCountRed(): int
    {
        return $this->countRed;
    }

    public function getTotal(): int
    {
        return $this->total;
    }
}
