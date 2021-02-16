<?php

class tasksProjectRepository extends tasksBaseRepository
{
    /**
     * @param tasksProject|tasksPersistableInterface $project
     * @param mixed                                  ...$params
     *
     * @return bool
     */
    public function save(tasksPersistableInterface $project, ...$params): bool
    {
        [$statuses] = $params;
        if (!parent::save($project)) {
            return false;
        }

        if (isset($statuses)) {
            $project_statuses_model = tsks()->getModel('tasksProjectStatuses');
            $project_statuses_model->setStatuses($project->getId(), $statuses);
        }

        return true;
    }
}
