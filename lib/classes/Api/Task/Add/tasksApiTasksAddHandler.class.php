<?php

final class tasksApiTasksAddHandler
{
    /**
     * @param tasksApiTasksAddRequest $addRequest
     *
     * @return tasksProject
     * @throws tasksAccessException
     * @throws tasksException
     * @throws waException
     */
    public function add(tasksApiTasksAddRequest $addRequest): tasksProject
    {
        $project = tsks()->getEntityRepository(tasksProject::class)->findById($addRequest->getProjectId());

        if (!$project) {
            throw new tasksException('Project not found', 404);
        }

        if (!tsks()->getRightResolver()->contactCanAddProject(wa()->getUser())) {
            throw new tasksAccessException();
        }

        if ($addRequest->getMilestoneId()) {
            $milestone = tsks()->getEntityRepository(tasksMilestone::class)->findById($addRequest->getMilestoneId());

            if (!$milestone) {
                throw new tasksException('Milestone not found', 404);
            }
        }

        $task2 = tsks()->getEntityFactory(tasksTask2::class)->createFromApiVo($addRequest);
        $task2->setProject($project)
            ->setNumber($task2->getProject()->getTasksNumber() + 1);

        if (!tsks()->getEntityRepository(tasksTask2::class)->save($task2)) {
            throw new tasksException('Error on task add');
        }

        tsks()->getModel(tasksProject::class)->recountTasksNumber($task2->getId());

        $task2->setLegacyTask(new tasksTask(tsks()->getModel(tasksTask2::class)->getById($task2->getId())));

        if ($addRequest->getFilesHash()) {
            (new tasksAttachmentModel())->addAttachmentsByHash($task2->getId(), null, $addRequest->getFilesHash());
        }

        (new tasksTagSaveHandler())->handle($task2);
        (new tasksRelationsSaveHandler())->handle($task2);
        (new tasksLogItemHandler())->log($task2, null, tasksLogItemHandler::ACTION_ADD);

        (new tasksWaLogManager())->lodAdd($task2);

        (new tasksEventTriggerHandler())->triggerAdd($task2);
        if ($task2->getAssignedContactId()) {
            $sender = new tasksNotificationsSender($task2->toArray(), 'new');
            $sender->send();
        }

        return $task2;
    }
}
