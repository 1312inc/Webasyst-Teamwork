<?php

class tasksMilestoneRepository extends tasksBaseRepository
{
    public function findById($id): ?tasksMilestone
    {
        /** @var tasksMilestone $milestone */
        $milestone = parent::findById($id);
        if (!$milestone) {
            return null;
        }

        $scopeCounts = tsks()->getModel('tasksTask')
            ->getCountTasksInScope();
        if ($scopeCounts) {
            foreach ($scopeCounts as $scopeCount) {
                if ($scopeCount['milestone_id'] != $milestone->getId()) {
                    continue;
                }

                $percent = $scopeCount['closed'] / $scopeCount['total'] * 100;
                $percent = round($percent);

                $milestone->setClosedPercent($percent);
            }
        }

        return $milestone;
    }
}
