<?php

/**
 * Class tasksTaskFactory
 *
 * @method tasksTask2 createNew()
 */
class tasksTask2Factory extends tasksBaseFactory
{
    public const DEFAULT_ICON  = 'blog';
    public const DEFAULT_COLOR = 't-white';

    /**
     * @var string
     */
    protected $entity = tasksTask2::class;

    public function createFromApiVo(tasksApiTasksAddRequest $addRequest): tasksTask2
    {
        $task = $this->createNew();

        $task
            ->setName($addRequest->getName())
            ->setText($addRequest->getText() ?: '')
            ->setDueDate($addRequest->getDueDate())
            ->setProjectId($addRequest->getProjectId())
            ->setMilestoneId($addRequest->getMilestoneId())
            ->setStatusId($addRequest->getStatusId() ?: 0)
            ->setCreateContactId($addRequest->getCreateContactId())
            ->setPriority($addRequest->getPriority())
            ->setHiddenTimestamp($addRequest->getHiddenTimestamp())
            ->setAssignedContactId($addRequest->getAssignedContactId())
            ->setUuid($addRequest->getUuid());

        return $task;
    }

    public function createFromLegacyTask(tasksTask $legacyTask): tasksTask2
    {
        $task = $this->createNew();

        $task
            ->setLegacyTask($legacyTask)
            ->setName($legacyTask->name)
            ->setText($legacyTask->text)
            ->setCreateContactId($legacyTask->create_contact_id)
            ->setPriority($legacyTask->priority)
            ->setNumber($legacyTask->number)
            ->setAssignedContactId($legacyTask->assigned_contact_id)
            ->setHiddenTimestamp($legacyTask->hidden_timestamp)
            ->setStatusId(!empty($legacyTask->getStatus()) ? $legacyTask->getStatus() : null);

        return $task;
    }

    /**
     * @return tasksHydratableInterface|tasksTask2
     */
    public function createNewWithData(array $data): tasksHydratableInterface
    {
        /** @var tasksTask2 $task2 */
        $task2 = parent::createNewWithData($data);

        $task2->setLegacyTask(new tasksTask($data));

        return $task2;
    }
}
