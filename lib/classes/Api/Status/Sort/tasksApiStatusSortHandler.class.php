<?php

final class tasksApiStatusSortHandler
{
    public function sort(tasksApiStatusSortRequest $sortRequest): array
    {
        $statusModel = tsks()->getModel(tasksStatus::class);

        foreach ($sortRequest->getSortedIds() as $sort => $sortedId) {
            $statusModel->updateById($sortedId, ['sort' => $sort]);
        }

        return tasksHelper::getStatuses(null, false);
    }
}
