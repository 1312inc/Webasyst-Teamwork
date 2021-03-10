<?php

final class tasksApiTasksAddHandler
{
    /**
     * @param tasksApiTasksAddRequest $addRequest
     *
     * @return tasksTask
     * @throws tasksAccessException
     * @throws tasksException
     * @throws waException
     */
    public function add(tasksApiTasksAddRequest $addRequest): tasksTask
    {
        if (!tsks()->getRightResolver()->contactCanAccessToProject(wa()->getUser(), $addRequest->getProjectId())) {
            throw new tasksAccessException();
        }



        if (!tsks()->getEntityRepository(tasksTask2::class)->save()) {
            throw new tasksException('Error on task add');
        }

        return ;
    }
}
