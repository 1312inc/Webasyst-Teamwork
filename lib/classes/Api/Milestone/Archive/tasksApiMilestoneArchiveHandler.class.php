<?php

final class tasksApiMilestoneArchiveHandler
{
    /**
     * @param tasksApiMilestoneArchiveRequest $archiveRequest
     *
     * @return bool
     * @throws tasksException
     * @throws waException
     * @throws tasksAccessException
     */
    public function archive(tasksApiMilestoneArchiveRequest $archiveRequest): bool
    {
        if (!tsks()->getRightResolver()->contactHasFullAccess(wa()->getUser())) {
            throw new tasksAccessException();
        }

        $repository = tsks()->getEntityRepository(tasksMilestone::class);

        /** @var tasksMilestone $milestone */
        $milestone = $repository->findById($archiveRequest->getId());
        if (!$milestone) {
            throw new tasksResourceNotFoundException('Milestone not found');
        }

        $milestone->setClosed($archiveRequest->isArchive());

        if (!$repository->save($milestone)) {
            throw new tasksException('Error on milestone archive');
        }

        return true;
    }
}
