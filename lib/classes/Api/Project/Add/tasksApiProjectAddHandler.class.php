<?php

final class tasksApiProjectAddHandler
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
        if ($addRequest->getProjectId()) {
            $project = tsks()->getEntityRepository(tasksProject::class)->findById($addRequest->getProjectId());

            if (!$project) {
                throw new tasksException('Project not found', 404);
            }

            if (!tsks()->getRightResolver()->contactCanAddProject(wa()->getUser())) {
                throw new tasksAccessException();
            }
        }

        if ($addRequest->getMilestoneId()) {
            $milestone = tsks()->getEntityRepository(tasksMilestone::class)->findById($addRequest->getMilestoneId());

            if (!$milestone) {
                throw new tasksException('Milestone not found', 404);
            }
        }

        $task = tsks()->getEntityFactory(tasksTask2::class)->createFromApiVo($addRequest);

        if (!tsks()->getEntityRepository(tasksTask2::class)->save($task)) {
            throw new tasksException('Error on task add');
        }

        if ($addRequest->getFilesHash()) {
            (new tasksAttachmentModel())->addAttachmentsByHash($task->getId(), null, $addRequest->getFilesHash());
        }

        (new tasksTagSaveHandler())->handle($task);
        (new tasksRelationsSaveHandler())->handle($task);
        (new tasksLogItemHandler())->logAdd($task, null, tasksLogItemHandler::ACTION_ADD);

        (new tasksWaLogManager())->lodAdd($task);

//        (new tasksEventTriggerHandler())->triggerAdd($task);
//        if ($task->getAssignedContactId()) {
//            $sender = new tasksNotificationsSender($task->toArray(), 'new');
//            $sender->send();
//        }

        return $task;
    }
}
