<?php

final class tasksApiStatusDeleteHandler
{
    public function delete(tasksApiStatusDeleteRequest $deleteRequest)
    {
        $statusModel = tsks()->getModel(tasksStatus::class);
        $status = $statusModel->getById($deleteRequest->getId());
        if (!$status) {
            throw new tasksResourceNotFoundException(_w('Status not found'));
        }

        $statusParamModel = tsks()->getModel('tasksStatusParams');
        $statusModel->deleteById($status['id']);
        $statusParamModel->deleteByField('status_id', $status['id']);

        $taskModel = tsks()->getModel(tasksTask::class);
        $taskModel->updateByField('status_id', $status['id'], [
            'status_id' => 0, // new
        ]);
    }
}
