<?php

final class tasksApiTaskDeleteHandler
{
    /**
     * @param tasksApiTaskDeleteRequest $deleteRequest
     *
     * @return array<int>
     * @throws waException
     */
    public function delete(tasksApiTaskDeleteRequest $deleteRequest): array
    {
        $taskModel = tsks()->getModel(tasksTask::class);
        $tasks = $taskModel->getById($deleteRequest->getIds());

        (new tasksRights())->extendTasksByRightsInfo($tasks);

        $taskIds = array_reduce(
            $tasks,
            static function ($taskIds, $task) {
                if ($task['rights_info']['can_delete']) {
                    $taskIds[] = (int) $task['id'];
                }

                return $taskIds;
            },
            []
        );

        if (!$taskIds) {
            return [];
        }

        /**
         * @event task_delete
         *
         * @param array [string]mixed $params
         * @param array [string]array $params['ids'] Array of IDs of deleting task entries
         *
         * @return void
         */
        $params = ['ids' => $taskIds];
        wa()->event('task_delete', $params);

        $taskModel->delete($taskIds);

        tsks()->getModel('tasksTaskRelations')
            ->deleteRelation($taskIds);

        tsks()->getModel('tasksTaskTags')
            ->deleteByField(['task_id' => $taskIds]);

        tsks()->getModel('tasksTag')
            ->deleteUnusedTags();

        (new tasksWaLogManager())->logDelete(count($taskIds));

        return $taskIds;
    }
}
