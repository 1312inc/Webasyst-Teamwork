<?php

/**
 * Class tasksTaskFactory
 *
 * @method tasksTask2 createNew()
 * @method tasksTask2 createNewWithData()
 */
class tasksTask2Factory extends tasksBaseFactory
{
    public const DEFAULT_ICON  = 'blog';
    public const DEFAULT_COLOR = 't-white';

    /**
     * @var string
     */
    protected $entity = tasksTask2::class;

    public function createFromApiVo(tasksApiTasksAddRequest $addRequest)
    {
        $task = $this->createNew();

//        $task->set;


//        return $task;
    }
}
