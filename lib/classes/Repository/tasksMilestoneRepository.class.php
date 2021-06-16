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

        $scopeCounts = tsks()->getModel('tasksTask')->getCountTasksInScope();
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

    /**
     * @param tasksMilestone|tasksPersistableInterface $milestone
     * @param mixed                                    ...$params
     *
     * @return bool
     */
    public function delete(tasksPersistableInterface $milestone, ...$params): bool
    {
        if (!parent::delete($milestone, $params)) {
            return false;
        }

        $this->getModel()->exec(
            'delete from tasks_releases_milestone_projects where milestone_id = i:id',
            ['id' => $milestone->getId()]
        );

        return true;
    }
}
