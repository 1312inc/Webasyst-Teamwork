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
        $task2->setUpdateDatetime(new DateTimeImmutable());

        if (!parent::save($task2, $params)) {
            return false;
        }

        return true;
    }
}
