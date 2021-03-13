<?php

class tasksMilestoneRepository extends tasksBaseRepository
{
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
