<?php

final class tasksApiCountsDtoFactory
{
    private static $service;

    public static function createFromArray(array $data): tasksApiCountsDto
    {
        return new tasksApiCountsDto(
            (int) ($data['closed'] ?? 0),
            (int) ($data['active_priority'] ?? 0),
            (int) ($data['active'] ?? 0),
            (int) ($data['total'] ?? 0)
        );
    }

    public static function createEmpty(): tasksApiCountsDto
    {
        return self::createFromArray([]);
    }

    public static function createForProjectId(int $projectId): tasksApiCountsDto
    {
        $data = self::getCountService()->getProjectCount($projectId);

        return self::createFromArray($data[$projectId] ?? []);
    }

    /**
     * @return array<tasksApiCountsDto>
     */
    public static function createForProjects(): array
    {
        $projectCounts = self::getCountService()->getProjectCounts();

        $counts = [];
        foreach ($projectCounts as $id => $projectCount) {
            $counts[$id] = self::createFromArray($projectCount);
        }

        return $counts;
    }

    public static function createForMilestoneId(int $milestoneId): tasksApiCountsDto
    {
        $data = self::getCountService()->getMilestoneCounts($milestoneId);

        return self::createFromArray($data[$milestoneId] ?? []);
    }

    /**
     * @return array<tasksApiCountsDto>
     */
    public static function createForMilestones(): array
    {
        $milestonesCounts = self::getCountService()->getMilestonesCounts();

        $counts = [];
        foreach ($milestonesCounts as $id => $milestoneCounts) {
            $counts[$id] = self::createFromArray($milestoneCounts);
        }

        return $counts;
    }

    public static function createForStatusId(int $statusId): tasksApiCountsDto
    {
        $data = self::getCountService()->getStatusCounts($statusId);

        return self::createFromArray($data[$statusId] ?? []);
    }

    /**
     * @return array<tasksApiCountsDto>
     */
    public static function createForStatuses(): array
    {
        $statusesCounts = self::getCountService()->getStatusesCounts();

        $counts = [];
        foreach ($statusesCounts as $id => $statusCounts) {
            $counts[$id] = self::createFromArray($statusCounts);
        }

        return $counts;
    }

    private static function getCountService(): tasksTasksCounterService
    {
        if (self::$service === null) {
            self::$service = new tasksTasksCounterService();
        }

        return self::$service;
    }
}
