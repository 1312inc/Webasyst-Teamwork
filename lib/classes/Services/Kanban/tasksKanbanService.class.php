<?php

final class tasksKanbanService
{
    public function getTasksForStatus(tasksKanbanRequestDto $requestDto): array
    {
        if ($requestDto->getStatus()['id'] === -1312) {
            $c = new tasksCollection(tasksCollection::HASH_UNASSIGNED);
            $this->applyFilters($c, $requestDto->getFilterTypes());
        } else {
            $c = new tasksCollection(tasksCollection::HASH_SEARCH);
            $this->applyFilters($c, $requestDto->getFilterTypes() + ['status_id' => $requestDto->getStatus()['id']]);
        }

        $this->applyOrder($c, 'priority');
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

    private function applyFilters(tasksCollection $c, $filters)
    {
        $filters && $c->filter($filters);
        $type = $c->getType();
        if (!in_array($type, ['search', 'outbox', 'status', 'id']) && (strpos($filters, 'status_id') === false)) {
            $c->addWhere('t.status_id >= 0');
        }
    }

    private function applyOrder(tasksCollection $c, $order)
    {
        switch ($order) {
            case 'newest':
                $c->orderBy('update_datetime', 'DESC');
                break;
            case 'oldest':
                $c->orderBy('create_datetime');
                break;
            case 'due':
                $c->orderByDue();
                break;
            case 'priority':
            default:
                break; // Nothing to do: collection defaults to priority ordering
        }
    }
}
