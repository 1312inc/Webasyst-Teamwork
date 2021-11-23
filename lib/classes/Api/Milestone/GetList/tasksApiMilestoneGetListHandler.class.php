<?php

final class tasksApiMilestoneGetListHandler
{
    /**
     * @return array
     */
    public function getMilestones(): array
    {
        $milestones = tsks()->getModel(tasksMilestone::class)
            ->getMilestonesWithOrder(false);

        tasksMilestoneModel::workup($milestones);

        foreach(tsks()->getModel(tasksMilestone::class)->getMilestoneStatuses() as $mid => $statuses) {
            if (!empty($milestones[$mid])) {
                $milestones[$mid]['statuses'] = array_keys($statuses);
            }
        }

        return $milestones;
    }
}
