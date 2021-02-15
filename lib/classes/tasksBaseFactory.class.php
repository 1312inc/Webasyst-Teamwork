<?php

/**
 * Class tasksBaseFactory
 */
class tasksBaseFactory
{
    /**
     * @var string
     */
    protected $entity;

    public function getEntity(): string
    {
        return $this->entity;
    }

    public function setEntity(string $entity): tasksBaseFactory
    {
        $this->entity = $entity;

        return $this;
    }

    public function createNew(): tasksHydratableInterface
    {
        $entity = $this->getEntity();

        return new $entity();
    }

    public function createNewWithData(array $data): tasksHydratableInterface
    {
        $entity = $this->createNew();

        return tsks()->getHydrator()->hydrate($entity, $data);
    }
}
