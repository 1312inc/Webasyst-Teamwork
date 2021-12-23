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

        $projects = tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray();
        foreach ($milestones as $id => $milestone) {
            if (!isset($projects[$milestone['project_id']])) {
                unset($milestones[$id]);
            }
        }

        tasksMilestoneModel::workup($milestones);
        foreach(tsks()->getModel(tasksMilestone::class)->getMilestoneStatuses() as $mid => $statuses) {
            if (!empty($milestones[$mid])) {
                $milestones[$mid]['statuses'] = array_keys($statuses);
            }
        }

        return $milestones;
    }
}
