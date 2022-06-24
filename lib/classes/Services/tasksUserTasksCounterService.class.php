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
        $priorities = tasksOptions::getTasksPriorities();
        $result = [];
        $availableProjects = (new tasksRights())->getAvailableProjectForContact($contact);
        $teamsCount = $this->taskModel->getTeamCounts();
        foreach ($teamsCount as $row) {
            if ($availableProjects !== true
                && !in_array($row['project_id'], $availableProjects[tasksRights::PROJECT_ANY_ACCESS])) {
                continue;
            }

            if (empty($result[$row['assigned_contact_id']])) {
                $result[$row['assigned_contact_id']] = $priorities[$row['priority']] + $row + ['total' => 0];
            } elseif ($result[$row['assigned_contact_id']]['value'] < $row['priority']) {
                $result[$row['assigned_contact_id']] = $priorities[$row['priority']] + $row + $result[$row['assigned_contact_id']];
            } else {
                $result[$row['assigned_contact_id']]['count'] += $row['count'];
            }

            $result[$row['assigned_contact_id']]['total'] += $row['count'];
        }

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
        $c = new tasksCollection(tasksCollection::HASH_OUTBOX);

        return $c->count();
    }

    public function getUrgentCount(): int
    {
        $c = new tasksCollection(tasksCollection::HASH_URGENT);

        return $c->count();
    }

    public function getSuperUrgentCount(): int
    {
        $c = new tasksCollection(tasksCollection::HASH_URGENT);
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

    public static function getPairs($total = 0, $count = 0, $bgColor = null, $textColor = null)
    {
        if (!$count) {
            return $total;
        }

        if ($count == $total && $bgColor === 'transparent' && $textColor === '#999') {
            return $count;
        }

        if ($count == $total) {
            return sprintf(
                '<span class="badge" style="background:%s;color:%s">%s</span>',
                ifempty($bgColor, 'transparent'),
                ifempty($textColor, '#999'),
                $count
            );
        }

        return sprintf(
            '<span class="badge custom-mr-4" style="background:%s;color:%s">%s</span>%s',
            ifempty($bgColor, 'transparent'),
            ifempty($textColor, '#999'),
            $count,
            $total
        );
    }
}
