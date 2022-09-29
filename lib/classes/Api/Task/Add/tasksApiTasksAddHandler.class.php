<?php

final class tasksApiTasksAddHandler
{
    /**
     * @param tasksApiTasksAddRequest $addRequest
     *
     * @return tasksTask2
     * @throws tasksAccessException
     * @throws tasksException
     * @throws tasksResourceNotFoundException
     * @throws waException
     */
    public function add(tasksApiTasksAddRequest $addRequest): tasksTask2
    {
        /** @var tasksProject $project */
        $project = tsks()->getEntityRepository(tasksProject::class)->findById($addRequest->getProjectId());

        if (!$project) {
            throw new tasksResourceNotFoundException('Project not found');
        }

        if (!tsks()->getRightResolver()->contactCanAccessToProject(wa()->getUser(), $project->getId())) {
            throw new tasksAccessException();
        }

        if ($addRequest->getMilestoneId()) {
            $milestone = tsks()->getEntityRepository(tasksMilestone::class)->findById($addRequest->getMilestoneId());

            if (!$milestone) {
                throw new tasksResourceNotFoundException('Milestone not found');
            }
        }

        $task2 = tsks()->getEntityFactory(tasksTask2::class)->createFromApiVo($addRequest);
        $task2->setProject($project)
            ->setNumber($project->getTasksNumber() + 1);

        if (!tsks()->getEntityRepository(tasksTask2::class)->save($task2)) {
            throw new tasksException('Error on task add');
        }

        tsks()->getModel(tasksProject::class)->recountTasksNumber($project->getId());

        $task2->setLegacyTask(new tasksTask(tsks()->getModel(tasksTask2::class)->getById($task2->getId())));

        if ($addRequest->getFilesHash()) {
            (new tasksAttachmentModel())->addAttachmentsByHash($task2->getId(), null, $addRequest->getFilesHash());
        }

        (new tasksTagSaveHandler())->handle($task2);
        (new tasksRelationsSaveHandler())->handle($task2);
        (new tasksLogItemHandler())->log($task2, null, tasksTaskLogModel::ACTION_TYPE_ADD);

        (new tasksWaLogManager())->lodAdd($task2);

        (new tasksEventTriggerHandler())->triggerAdd($task2);
        if ($task2->getAssignedContactId()) {
            $sender = new tasksNotificationsSender($task2->toArray(), 'new');
            $sender->send();
        }

        return $task2;
    }
}
