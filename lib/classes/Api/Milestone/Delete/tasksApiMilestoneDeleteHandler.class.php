<?php

final class tasksApiMilestoneDeleteHandler
{
    /**
     * @param tasksApiMilestoneDeleteRequest $deleteRequest
     *
     * @return bool
     * @throws tasksException
     * @throws waException
     */
    public function delete(tasksApiMilestoneDeleteRequest $deleteRequest): bool
    {
        if (!tsks()->getRightResolver()->contactHasFullAccess(wa()->getUser())) {
            throw new tasksAccessException();
        }

        $repository = tsks()->getEntityRepository(tasksMilestone::class);

        /** @var tasksMilestone $milestone */
        $milestone = $repository->findById($deleteRequest->getId());
        if (!$milestone) {
            throw new tasksResourceNotFoundException('Milestone not found');
        }

        if (!$repository->delete($milestone)) {
            throw new tasksException('Error on milestone delete');
        }

        return true;
    }
}
