<?php

final class tasksApiMilestoneGetListHandler
{
    /**
     * @return array<tasksMilestone>
     */
    public function getMilestones(): array
    {
        /** @var tasksMilestone[] $milestones */
        $milestones = tsks()->getEntityRepository(tasksMilestone::class)->findAll();

//        $statuses = tsks()->getModel(tasksMilestone::class)->getMilestoneStatuses();

        return $milestones;
    }
}
