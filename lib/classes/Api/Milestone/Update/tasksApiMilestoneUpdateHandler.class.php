<?php

final class tasksApiMilestoneUpdateHandler
{
    /**
     * @param tasksApiMilestoneUpdateRequest $updateRequest
     *
     * @return tasksMilestone
     * @throws tasksAccessException
     * @throws tasksException
     * @throws waException
     */
    public function add(tasksApiMilestoneUpdateRequest $updateRequest): tasksMilestone
    {
        if (!tsks()->getRightResolver()->contactHasFullAccess(wa()->getUser())) {
            throw new tasksAccessException();
        }

        /** @var tasksMilestone|null $milestone */
        $milestone = tsks()->getEntityRepository(tasksMilestone::class)->findById($updateRequest->getId());
        if ($milestone) {
            throw new tasksException('No milestone found', 404);
        }

        $milestone
            ->setProjectId($updateRequest->getProjectId())
            ->setDueDate($updateRequest->getDueDate())
            ->setDescription($updateRequest->getDescription())
            ->setName($updateRequest->getName());

        (new tasksMilestoneValidator())->isValid($milestone);

        if (!tsks()->getEntityRepository(tasksMilestone::class)->save($milestone)) {
            throw new tasksException('Error on milestone update');
        }

        return $milestone;
    }
}
