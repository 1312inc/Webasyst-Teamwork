<?php

interface tasksEntityRepositoryInterface
{
    public function save(tasksPersistableInterface $entity, ...$params): bool;

    public function delete(tasksPersistableInterface $entity, ...$params): bool;
}
