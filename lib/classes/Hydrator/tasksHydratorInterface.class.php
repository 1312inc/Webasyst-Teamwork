<?php

/**
 * Interface tasksHydratorInterface
 */
interface tasksHydratorInterface
{
    /**
     * @param tasksHydratableInterface $object
     * @param array                    $fields
     * @param array                    $dbFields
     *
     * @return array
     */
    public function extract(tasksHydratableInterface $object, array $fields = [], $dbFields = []): array;

    /**
     * @param tasksHydratableInterface $object
     * @param array                    $data
     *
     * @return tasksHydratableInterface
     */
    public function hydrate(tasksHydratableInterface $object, array $data): tasksHydratableInterface;
}
