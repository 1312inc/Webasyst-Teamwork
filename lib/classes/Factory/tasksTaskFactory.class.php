<?php

/**
 * Class tasksTaskFactory
 *
 * @method tasksTaskObj createNew()
 * @method tasksTaskObj createNewWithData()
 */
class tasksTaskFactory extends tasksBaseFactory
{
    public const DEFAULT_ICON  = 'blog';
    public const DEFAULT_COLOR = 't-white';

    /**
     * @var string
     */
    protected $entity = tasksTaskObj::class;

    public function createFromApiVo(tasksApiTasksAddRequest $addRequest): tasksTaskObj
    {
        $task = $this->createNew();

        $task->set;


        return $task;
    }
}
