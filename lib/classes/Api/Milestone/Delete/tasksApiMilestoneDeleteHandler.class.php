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

        /**
         * @event milestone_delete
         *
         * @param array [string]mixed $params
         * @param array [string]array $params['ids'] Array of IDs of deleting milestone entries
         *
         * @return void
         */
        $params = ['ids' => [$milestone->getId()]];
        wa()->event('milestone_delete', $params);

        return true;
    }
}
