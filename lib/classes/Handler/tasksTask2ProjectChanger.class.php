<?php

final class tasksTask2ProjectChanger
{
    public function changeProject(tasksTask2 $task2, int $projectId): bool
    {
        if ($task2->getProjectId() === $projectId) {
            return false;
        }

        $projectRep = tsks()->getEntityRepository(tasksProject::class);

        /** @var tasksProject $project */
        $project = $projectRep->findById($projectId);
        if (!$project) {
            return false;
        }

        // keeping fresh tasks_number
        $number = $project->getTasksNumber() + 1;
        $task2->setNumber($number)
            ->setProjectId($projectId);

        tsks()->getEntityRepository(tasksTask2::class)->save($task2);

        $projectRep->getModel()->recountTasksNumber($project->getId());

        return true;
    }
}
