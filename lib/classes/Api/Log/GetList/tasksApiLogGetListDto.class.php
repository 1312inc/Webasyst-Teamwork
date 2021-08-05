<?php

final class tasksApiLogGetListDto
{
    /**
     * @var int
     */
    private $total;

    /**
     * @var int
     */
    private $count;

    /**
     * @var array
     */
    private $logs;

    public function __construct(int $total, int $count, array $logs)
    {
        $this->total = $total;
        $this->count = $count;
        $this->logs = $logs;
    }

    public function getTotal(): int
    {
        return $this->total;
    }

    public function getCount(): int
    {
        return $this->count;
    }

    public function getLogs(): array
    {
        return $this->logs;
    }

    public function groupLogsByDates(): array
    {
        $today = waDateTime::date('Y-m-d');
        $yesterday = waDateTime::date('Y-m-d', strtotime('yesterday'));

        $grouped = [
            $today => [
                'group' => _w('Today'),
                'items' => [],
            ],
            $yesterday => [
                'group' => _w('Yesterday'),
                'items' => [],
            ],
        ];

        $monthNames = waDateTime::getMonthNames();

        foreach ($this->logs as $log) {
            $groupBy = waDateTime::date('Y-m-d', strtotime($log['create_datetime']));
            if (isset($grouped[$groupBy])) {
                $grouped[$groupBy]['items'][] = $log;

                continue;
            }

            $groupBy = waDateTime::date('n-Y', strtotime($log['create_datetime']));
            $groupByExploded = explode('-', $groupBy);
            if (!isset($grouped[$groupBy])) {
                $grouped[$groupBy] = [
                    'group' => sprintf('%s %d', $monthNames[$groupByExploded[0]], $groupByExploded[1]),
                    'items' => [],
                ];
            }

            $grouped[$groupBy]['items'][] = $log;
        }

        return $grouped;
    }
}
