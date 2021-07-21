<?php

final class tasksUserTasksCounterService
{
    /**
     * @var tasksTaskModel
     */
    private $taskModel;

    public function __construct()
    {
        $this->taskModel = new tasksTaskModel();
    }

    public function getHiddenCount(waContact $contact): int
    {
        return (int) $this->taskModel
            ->query(
                'SELECT COUNT(*) FROM tasks_task WHERE hidden_timestamp > i:0 AND
assigned_contact_id = i:1',
                time(),
                $contact->getId()
            )
            ->fetchField();
    }

    public function getTeamCounts(waContact $contact): array
    {
        $result = $this->taskModel->getTeamCounts();

        if (!$contact->isAdmin(tasksConfig::APP_ID)) {
            // Non-admin can only see own counter
            $result = array_intersect_key($result, [$contact->getId() => 1]);
        }

        return $result;
    }

    public function getFavoritesCounts()
    {
        return $this->taskModel->getFavoritesCounts();
    }

    public function getOutboxCount(): int
    {
        $c = new tasksCollection('outbox');

        return $c->count();
    }

    public function getUrgentCount(): int
    {
        $c = new tasksCollection('urgent');

        return $c->count();
    }

    public function getSuperUrgentCount(): int
    {
        $c = new tasksCollection('urgent');
        $c->filter('priority>1');

        return $c->count();
    }

    public function getStatusCounts(waContact $contact): ?array
    {
        if ($contact->isAdmin(tasksConfig::APP_ID)) {
            return $this->taskModel
                ->query(
                    'SELECT status_id, COUNT(*)
                    FROM tasks_task t JOIN tasks_project p ON t.project_id = p.id
                    WHERE p.archive_datetime IS NULL
                    GROUP BY status_id'
                )
                ->fetchAll('status_id', true);
        }

        return null;
    }
}
