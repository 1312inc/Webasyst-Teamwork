<?php

final class tasksApiTaskGetListHandler
{
    /**
     * @param tasksApiTaskGetListRequest $filter
     *
     * @return tasksApiTasksResponse
     */
    public function getTasks(tasksApiTaskGetListRequest $filter): tasksApiTasksResponse
    {
        $collection = new tasksCollection($filter->getHash());
        $collectionInfo = $collection->getInfo();

        tasksLogger::debug(sprintf('Into %s. %s', __CLASS__, $filter->getHash()));
        tasksLogger::debug($collectionInfo);

        $this->applyFilters($collection, $filter->getFilters());
        $this->applySince($collection, $filter->getSince());
        $this->applyOrder($collection, $filter->getOrder() ?: $this->getDefaultOrder($collection));

        tasksLogger::debug(sprintf('Into %s. Collection.', __CLASS__));
        tasksLogger::debug($collection);

        $totalCount = null;
        $taskRows = $collection->getTasks(
            tasksCollection::FIELDS_TO_GET,
            $filter->getOffset(),
            $filter->getLimit(),
            $totalCount
        );

        tasksLogger::debug(sprintf('Into %s. Collection done.', __CLASS__));

        tasksHelper::workupTasksForView($taskRows);

        tasksLogger::debug(sprintf('Into %s. workupTasksForView done.', __CLASS__));

        return new tasksApiTasksResponse($taskRows, (int) $totalCount);
    }

    private function applyFilters(tasksCollection $collection, $filters): void
    {
        if ($filters) {
            $collection->filter($filters);
        }

        $type = $collection->getType();
        if (!in_array($type, [
                tasksCollection::HASH_SEARCH,
                tasksCollection::HASH_OUTBOX,
                tasksCollection::HASH_STATUS,
                tasksCollection::HASH_ID,
            ], true)
            && (strpos($filters, 'status_id') === false)
        ) {
            $collection->addWhere('t.status_id >= 0');
        }
    }

    private function applySince(tasksCollection $collection, ?int $since): void
    {
        if ($since) {
            $collection->addWhere(sprintf("t.update_datetime > '%s'", date('Y-m-d H:i:s', $since)));
        }
    }

    private function applyOrder(tasksCollection $c, $order)
    {
        switch ($order) {
            case tasksCollection::ORDER_NEWEST:
                $c->orderBy('update_datetime', 'DESC');
                break;
            case tasksCollection::ORDER_OLDEST:
                $c->orderBy('create_datetime');
                break;
            case tasksCollection::ORDER_DUE:
                $c->orderByDue();
                break;
            case tasksCollection::ORDER_PRIORITY:
            default:
                break; // Nothing to do: collection defaults to priority ordering
        }
    }

    private function getDefaultOrder(tasksCollection $collection): string
    {
        $type = $collection->getType();
        $info = $collection->getInfo();
        if ($type === 'outbox') {
            $order = 'oldest';
        } elseif ($type === 'status' && $info['id'] == -1) {
            $order = 'newest';
        } else {
            $order = 'priority';
        }

        return $order;
    }
}
