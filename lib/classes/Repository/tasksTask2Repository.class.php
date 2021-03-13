<?php

class tasksTask2Repository extends tasksBaseRepository
{
    /**
     * @param tasksTask2|tasksPersistableInterface $task2
     * @param mixed                                ...$params
     *
     * @return bool
     */
    public function save(tasksPersistableInterface $task2, ...$params): bool
    {
        $insert = false;
        if (!$task2->getId()) {
            $insert = true;
            if (!$task2->getProject()) {
                /** @var tasksProject $project */
                $project = tsks()->getEntityRepository(tasksProject::class)->findById($task2->getProjectId());
                if (!$project) {
                    throw new tasksException(sprintf('No project %d for task', $task2->getProjectId()));
                }

                $task2->setProject($project);
            }

            $task2->setNumber($task2->getProject()->getTasksNumber() + 1);
        }

        $task2->setUpdateDatetime(new DateTimeImmutable());

        if (!parent::save($task2, $params)) {
            return false;
        }

        if ($insert) {
            tsks()->getModel(tasksProject::class)->recountTasksNumber($task2->getId());
        }

        $task2->setLegacyTask(new tasksTask($this->getModel()->getById($task2->getId())));

        return true;
    }
}
