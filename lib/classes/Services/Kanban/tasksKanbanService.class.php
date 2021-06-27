<?php

final class tasksKanbanService
{
    public function getTasksForStatus(tasksKanbanRequestDto $requestDto): array
    {
        $c = new tasksCollection(tasksCollection::HASH_STATUS . '/' . $requestDto->getStatus()['id']);

        $this->applyFilters($c, $requestDto->getFilters());

        if (!$requestDto->isWithUnassigned()) {
            $c->filter('assigned_contact_id>0');
            // убрать удаленных и заблокированных - приравниваем к незаассайненым
            $c->addJoin('wa_contact', ':table.id=t.assigned_contact_id', ':table.is_user>-1');
        }

        $this->applyOrder($c, $requestDto->getOrder());
        $totalCount = null;
        $taskRows = $c->getTasks(
            tasksCollection::FIELDS_TO_GET,
            $requestDto->getOffset(),
            $requestDto->getLimit(),
            $totalCount
        );

        $tasks = [];
        foreach ($taskRows as $t) {
            $tasks[$t['id']] = new tasksTask($t);
        }
        unset($taskRows);

        return [
            'count' => $totalCount,
            'tasks' => $tasks,
        ];
    }

    private function applyFilters(tasksCollection $c, $filters): void
    {
        $filters && $c->filter($filters);
        $type = $c->getType();
        if (!in_array(
                $type,
                [
                    tasksCollection::HASH_SEARCH,
                    tasksCollection::HASH_OUTBOX,
                    tasksCollection::HASH_STATUS,
                    tasksCollection::HASH_ID,
                    tasksCollection::HASH_UNASSIGNED,
                    tasksCollection::HASH_TAG,
                ],
                true
            ) && (strpos($filters, 'status_id') === false)
        ) {
            $c->addWhere('t.status_id >= 0');
        }
    }

    private function applyOrder(tasksCollection $c, $order): void
    {
        switch ($order) {
            case tasksKanbanRequestDto::ORDER_NEWEST:
                $c->orderBy('update_datetime', 'DESC');
                break;
            case tasksKanbanRequestDto::ORDER_OLDEST:
                $c->orderBy('create_datetime');
                break;
            case tasksKanbanRequestDto::ORDER_DUE:
                $c->orderByDue();
                break;
            case tasksKanbanRequestDto::ORDER_PRIORITY:
            default:
                break; // Nothing to do: collection defaults to priority ordering
        }
    }
}
