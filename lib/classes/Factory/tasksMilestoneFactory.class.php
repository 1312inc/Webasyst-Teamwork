<?php

/**
 * Class tasksMilestoneFactory
 *
 * @method tasksMilestone createNew()
 * @method tasksMilestone createNewWithData()
 */
class tasksMilestoneFactory extends tasksBaseFactory
{
    /**
     * @var string
     */
    protected $entity = tasksMilestone::class;

    public function createFromApiVo(tasksApiMilestoneAddRequest $addRequest): tasksMilestone
    {
        $milestone = $this->createNew();
        $milestone
            ->setName($addRequest->getName())
            ->setDescription($addRequest->getDescription())
            ->setDueDate($addRequest->getDueDate())
            ->setProjectId($addRequest->getProjectId());

        return $milestone;
    }
}
