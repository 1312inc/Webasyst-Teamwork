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
    public function update(tasksApiMilestoneUpdateRequest $updateRequest): tasksMilestone
    {
        if (!tsks()->getRightResolver()->contactHasFullAccess(wa()->getUser())) {
            throw new tasksAccessException();
        }

        /** @var tasksMilestone|null $milestone */
        $milestone = tsks()->getEntityRepository(tasksMilestone::class)->findById($updateRequest->getId());
        if (!$milestone) {
            throw new tasksException('No milestone found', 404);
        }

        $milestone
            ->setProjectId($updateRequest->getProjectId())
            ->setName($updateRequest->getName());

        if ($updateRequest->getDueDate()) {
            $milestone->setDueDate($updateRequest->getDueDate());
        }

        if ($updateRequest->getDescription() !== null) {
            $milestone->setDescription($updateRequest->getDescription());
        }

        (new tasksMilestoneValidator())->isValid($milestone);

        if (!tsks()->getEntityRepository(tasksMilestone::class)->save($milestone)) {
            throw new tasksException('Error on milestone update');
        }

        return $milestone;
    }
}
