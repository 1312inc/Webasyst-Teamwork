<?php

final class tasksRelationsSaveHandler
{
    /**
     * @see \tasksTasksSaveController::saveTaskRelations
     */
    public function handle(tasksTask2 $task, tasksTask2 $prevTask = null): bool
    {
        $tasksTaskRelationsModel = new tasksTaskRelationsModel();
        $tasksNumber = tasksTask::extractTaskNumbers($task->getText());
        $newIds = $this->parseTaskNumberAndGetTaskId($tasksNumber);

        if ($prevTask) {
            $prevTaskNumber = tasksTask::extractTaskNumbers($prevTask->getText());
            $oldIds = $this->parseTaskNumberAndGetTaskId($prevTaskNumber);
        }

        //You can not save a link to yourself
        $oldIds[$task->getId()] = [];

        return $tasksTaskRelationsModel->save($task->getId(), $newIds, $oldIds);
    }

    protected function parseTaskNumberAndGetTaskId($tasksNumber = [], $fetch = 'id'): array
    {
        if (!$tasksNumber) {
            return [];
        }

        $task_model = new tasksTaskModel();

        $where = [];
        $paramsWhere = [];

        foreach ($tasksNumber as $number) {
            $numberParse = explode('.', $number);
            $where[] = '(project_id = ? AND number = ?)';
            $paramsWhere = array_merge($paramsWhere, $numberParse);
        }

        $taskIds = $task_model
            ->select(' id, concat(project_id, \'.\', number) as full_number ')
            ->where(implode(' OR ', $where), $paramsWhere)
            ->fetchAll($fetch);

        return $taskIds;
    }
}
