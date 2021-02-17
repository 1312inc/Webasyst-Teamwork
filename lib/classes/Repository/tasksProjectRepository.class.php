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
        if ($params) {
            [$statuses] = $params;
        }

        if (!parent::save($project)) {
            return false;
        }

        if (!empty($statuses)) {
            $project_statuses_model = tsks()->getModel('tasksProjectStatuses');
            $project_statuses_model->setStatuses($project->getId(), $statuses);
        }

        return true;
    }

    /**
     * @param tasksProject|tasksPersistableInterface $project
     * @param mixed                                  ...$params
     *
     * @return bool
     */
    public function delete(tasksPersistableInterface $project, ...$params): bool
    {
        if (!parent::delete($project, $params)) {
            return false;
        }

        // delete related data
        tsks()->getModel('tasksProjectStatuses')->deleteByField(['project_id' => $project->getId()]);
        tsks()->getModel('tasksProjectStatusParams')->deleteByField(['project_id' => $project->getId()]);

        return true;
    }
}
