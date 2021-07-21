<?php

interface tasksPersistableInterface extends tasksHydratableInterface
{
    public function setId($id);

    public function getId();
}
