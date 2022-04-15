<?php

final class tasksApiTasksUpdateHandler
{
    /**
     * @param tasksApiTasksUpdateRequest $updateRequest
     *
     * @return tasksTask2
     * @throws tasksException
     * @throws waException
     * @throws waRightsException
     */
    public function update(tasksApiTasksUpdateRequest $updateRequest): tasksTask2
    {
        $repository = tsks()->getEntityRepository(tasksTask2::class);
        /** @var tasksTask2 $task2 */
        $task2 = $repository->findById($updateRequest->getId());
        if (!$task2) {
            throw new tasksException('Not found', 404);
        }

        $rights = new tasksRights();
        if (!$rights->canEditTask($task2->getLegacyTask())) {
            throw new waRightsException(_w('Access denied'));
        }

        $prevTask2 = clone $task2;

        $task2
            ->setMilestoneId($updateRequest->getMilestoneId())
            ->setStatusId($updateRequest->getStatusId())
            ->setAssignedContactId($updateRequest->getAssignedContactId())
            ->setHiddenTimestamp($updateRequest->getHiddenTimestamp())
            ->setPriority($updateRequest->getPriority())
            ->setText($updateRequest->getText())
            ->setName($updateRequest->getName())
            ->setDueDate($updateRequest->getDueDate());

        $repository->save($task2);
        $projectChanged = false;
        if ($updateRequest->getProjectId() !== $task2->getProjectId()) {
            $projectChanged = (new tasksTask2ProjectChanger())->changeProject($task2, $updateRequest->getProjectId());
            if ($projectChanged) {
                (new tasksTaskLogModel())->updateByField(
                    'task_id',
                    $task2->getId(),
                    ['project_id' => $task2->getProjectId()]
                );
            }
        }

        if ($updateRequest->getFilesHash()) {
            tsks()->getModel(tasksAttachment::class)
                ->addAttachmentsByHash($task2->getId(), null, $updateRequest->getFilesHash());
        }

        $attachmentDeleteHandler = new tasksApiAttachmentDeleteHandler();
        if ($updateRequest->getAttachmentsToDelete()) {
            try {
                $attachmentDeleteHandler->delete(
                    new tasksApiAttachmentDeleteRequest($updateRequest->getAttachmentsToDelete())
                );
            } catch (tasksResourceNotFoundException $exception) {
                // silence
            }
        }

        (new tasksTagSaveHandler())->handle($task2, $prevTask2);
        (new tasksRelationsSaveHandler())->handle($task2, $prevTask2);

        $logItem = (new tasksLogItemHandler())->log(
            $task2,
            $prevTask2->getStatusId(),
            tasksTaskLogModel::ACTION_TYPE_EDIT
        );

        if ($projectChanged) {
            (new tasksTaskLogParamsModel())->insert(
                [
                    'task_id' => $task2->getId(),
                    'log_id' => (int) $logItem['id'],
                    'name' => 'prev.project.number',
                    'value' => $prevTask2->getProjectId() . '.' . $prevTask2->getNumber(),
                ]
            );
        }

        (new tasksWaLogManager())->lodEdit($task2, (int) $logItem['id']);

        (new tasksEventTriggerHandler())->triggerEdit($prevTask2);

        $sender = new tasksNotificationsSender($task2->toArray(), 'edit');
        $sender->send();

        return $task2;
    }
}
