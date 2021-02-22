<?php

interface tasksEntityValidatorInterface
{
    /**
     * @param tasksPersistableInterface $entity
     *
     * @return bool
     * @throws tasksValidationException
     */
    public function isValid(tasksPersistableInterface $entity): bool;
}
