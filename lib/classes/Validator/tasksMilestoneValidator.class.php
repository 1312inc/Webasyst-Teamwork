<?php

final class tasksMilestoneValidator implements tasksEntityValidatorInterface
{
    /**
     * @param tasksPersistableInterface|tasksMilestone $milestone
     *
     * @return bool
     * @throws tasksValidationException
     */
    public function isValid(tasksPersistableInterface $milestone): bool
    {
        if (!tsks()->getEntityRepository(tasksProject::class)->findById($milestone->getProjectId())) {
            throw new tasksValidationException('No project with such id');
        }

        if (empty($milestone->getName())) {
            throw new tasksValidationException('Empty name');
        }

//        if ($milestone->getDueDate() < new DateTimeImmutable()) {
//            throw new tasksValidationException('Due date must be in future');
//        }

        return true;
    }
}
