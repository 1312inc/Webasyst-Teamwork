<?php

final class tasksApiMilestoneAddHandler
{
    /**
     * @param tasksApiMilestoneAddRequest $addRequest
     *
     * @return tasksMilestone
     * @throws tasksAccessException
     * @throws tasksException
     * @throws waException
     */
    public function add(tasksApiMilestoneAddRequest $addRequest): tasksMilestone
    {
        if (!tsks()->getRightResolver()->contactHasFullAccess(wa()->getUser())) {
            throw new tasksAccessException();
        }

        $milestone = tsks()->getEntityFactory(tasksMilestone::class)
            ->createFromApiVo($addRequest);

        if (!$milestone->getId()) {
            $milestone->setStartDate(date('Y-m-d'));
        }

        if (!tsks()->getEntityRepository(tasksMilestone::class)->save($milestone)) {
            throw new tasksException('Error on milestone add');
        }

        return $milestone;
    }
}
