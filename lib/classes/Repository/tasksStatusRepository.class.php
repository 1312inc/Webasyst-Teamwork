<?php

class tasksStatusRepository extends tasksBaseRepository
{
    /**
     * @return array<tasksStatus>
     */
    public function findAll()
    {
        return $this
            ->findByQuery(
                $this->getModel()
                    ->select('*')
                    ->order('sort')
            );
    }
}
