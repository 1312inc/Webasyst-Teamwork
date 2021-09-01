<?php

final class tasksTasksCounterService
{
    /**
     * @var tasksTaskModel
     */
    private $taskModel;

    /**
     * For the purpose of sidebar counts we only differentiate
     * between urgent=2 and everything else being normal=0.
     *
     * @var string
     */
    private $priorityField = "IF(t.priority>=2, 2, 0)";

    public function __construct()
    {
        $this->taskModel = new tasksTaskModel();
    }

    /** Count non-done tasks for all projects: total and highest priority. */
    public function getProjectCountsWithPriority(): array
    {
        $sql = sprintf(
            "SELECT t.project_id relevant_id, %s AS priority, count(*) AS `count`
                    FROM %s t 
                    JOIN tasks_project p ON t.project_id = p.id
                    WHERE t.status_id > -1 
                      AND p.archive_datetime IS NULL 
                    GROUP BY relevant_id, %s",
            $this->priorityField,
            $this->taskModel->getTableName(),
            $this->priorityField
        );

        return $this->collectCountWithPriorityInfo($sql);
    }

    /** Count non-done tasks for all projects: total and highest priority. */
    public function getProjectCounts(): array
    {
        $sql = sprintf(
            "SELECT t.project_id relevant_id, t.status_id, %s AS priority, count(*) AS `count`
                    FROM %s t 
                    JOIN tasks_project p ON t.project_id = p.id
                    WHERE t.status_id >= -1 
                      AND p.archive_datetime IS NULL 
                    GROUP BY relevant_id, t.status_id, %s",
            $this->priorityField,
            $this->taskModel->getTableName(),
            $this->priorityField
        );

        return $this->collectCount($sql);
    }

    public function getProjectCount(int $projectId): array
    {
        $sql = sprintf(
            "SELECT t.project_id relevant_id, t.status_id, %s AS priority, count(*) AS `count`
                    FROM %s t 
                    JOIN tasks_project p ON t.project_id = p.id
                    WHERE t.status_id >= -1 
                      AND p.archive_datetime IS NULL 
                      AND t.project_id = %d
                    GROUP BY relevant_id, t.status_id, %s",
            $this->priorityField,
            $this->taskModel->getTableName(),
            $projectId,
            $this->priorityField
        );

        return $this->collectCount($sql);
    }

    /** Count non-done tasks  for all projects: total and highest priority. */
    public function getMilestonesCounts(): array
    {
        $sql = sprintf(
            "SELECT t.milestone_id relevant_id, t.status_id, %s AS priority, count(*) AS `count`
                    FROM %s t 
                    JOIN tasks_milestone p ON t.milestone_id = p.id
                    WHERE t.status_id >= -1 
                      AND p.closed = 0 
                    GROUP BY relevant_id, t.status_id, %s",
            $this->priorityField,
            $this->taskModel->getTableName(),
            $this->priorityField
        );

        return $this->collectCount($sql);
    }

    public function getMilestoneCounts(int $milestoneId): array
    {
        $sql = sprintf(
            "SELECT t.milestone_id relevant_id, t.status_id, %s AS priority, count(*) AS `count`
                    FROM %s t 
                    JOIN tasks_milestone p ON t.milestone_id = p.id
                    WHERE t.status_id >= -1 
                      AND p.closed = 0 
                      AND t.milestone_id = %d
                    GROUP BY relevant_id, t.status_id, %s",
            $this->priorityField,
            $this->taskModel->getTableName(),
            $milestoneId,
            $this->priorityField
        );

        return $this->collectCount($sql);
    }

    public function getStatusesCounts(): array
    {
        $sql = sprintf(
            "SELECT t.status_id relevant_id, t.status_id, %s AS priority, count(*) AS `count`
                    FROM %s t 
                    JOIN tasks_status p ON t.status_id = p.id
                    GROUP BY relevant_id, t.status_id, %s",
            $this->priorityField,
            $this->taskModel->getTableName(),
            $this->priorityField
        );

        return $this->collectCount($sql);
    }

    public function getStatusCounts(int $statusId): array
    {
        $sql = sprintf(
            "SELECT t.status_id relevant_id, t.status_id, %s AS priority, count(*) AS `count`
                    FROM %s t 
                    JOIN tasks_status p ON t.status_id = p.id
                    WHERE t.status_id = %d
                    GROUP BY relevant_id, t.status_id, %s",
            $this->priorityField,
            $this->taskModel->getTableName(),
            $statusId,
            $this->priorityField
        );

        return $this->collectCount($sql);
    }

    /**
     * @return array
     * @throws waDbException
     */
    private function collectCount(string $sql): array
    {
        $result = [];

        foreach ($this->taskModel->query($sql) as $row) {
            if (!isset($result[$row['relevant_id']])) {
                $result[$row['relevant_id']] = [
                    'closed' => 0,
                    'active' => 0,
                    'active_priority' => 0,
                    'total' => 0,
                ];
            }

            switch (true) {
                case $row['status_id'] == -1 && $row['priority'] < 2:
                    $result[$row['relevant_id']]['closed'] += $row['count'];
                    break;

                case $row['status_id'] >= 0 && $row['priority'] == 2:
                    $result[$row['relevant_id']]['active_priority'] += $row['count'];

                case $row['status_id'] >= 0 && $row['priority'] < 2:
                    $result[$row['relevant_id']]['active'] += $row['count'];
                    break;
            }

            $result[$row['relevant_id']]['total'] += $row['count'];
        }

        return $result;
    }

    /**
     * @return array
     * @throws waDbException
     */
    private function collectCountWithPriorityInfo(string $sql): array
    {
        $priorities = tasksOptions::getTasksPriorities();
        $result = [];

        foreach ($this->taskModel->query($sql) as $row) {
            if (empty($result[$row['relevant_id']])) {
                $result[$row['relevant_id']] = $priorities[$row['priority']]
                    + $row
                    + ['total' => 0];
            } elseif ($result[$row['relevant_id']]['value'] < $row['priority']) {
                $result[$row['relevant_id']] = $priorities[$row['priority']]
                    + $row
                    + $result[$row['relevant_id']];
            }

            $result[$row['relevant_id']]['total'] += $row['count'];
        }

        return $result;
    }
}
