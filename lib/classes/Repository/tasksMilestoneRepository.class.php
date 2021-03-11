<?php

class tasksTasks2Repository extends tasksBaseRepository
{
    /**
     * @param tasksTask2|tasksPersistableInterface $task2
     * @param mixed                                ...$params
     *
     * @return bool
     */
    public function save(tasksPersistableInterface $task2, ...$params): bool
    {
        if (!parent::save($task2, $params)) {
            return false;
        }

        tsks()->getModel(tasksProject::class)->recountTasksNumber($task2->getId());

        $task2->setLegacyTask(new tasksTask($this->getModel()->getById($task2->getId())));

        return true;
    }
}
