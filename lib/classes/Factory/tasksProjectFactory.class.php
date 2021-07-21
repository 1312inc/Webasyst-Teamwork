<?php

/**
 * Class tasksProjectFactory
 *
 * @method tasksProject createNew()
 * @method tasksProject createNewWithData()
 */
class tasksProjectFactory extends tasksBaseFactory
{
    public const DEFAULT_ICON  = 'blog';
    public const DEFAULT_COLOR = 't-white';

    /**
     * @var string
     */
    protected $entity = tasksProject::class;

    public function createFromApiVo(tasksApiProjectAddRequest $addRequest): tasksProject
    {
        $project = $this->createNew();

        $project
            ->setColor($addRequest->getColor() ?: self::DEFAULT_COLOR)
            ->setContactId(wa()->getUser()->getId())
            ->setCreateDatetime(new DateTimeImmutable())
            ->setName($addRequest->getName())
            ->setIcon($addRequest->getIcon() ?: self::DEFAULT_ICON);


        if ($addRequest->getIconUrl()) {
            $project->setIcon($addRequest->getIconUrl());
        }

        return $project;
    }
}
