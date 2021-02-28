<?php

final class tasksApiTasksAddHandler
{
    /**
     * @param tasksApiTasksAddRequest $addRequest
     *
     * @return tasksTaskObj
     * @throws tasksAccessException
     * @throws tasksException
     * @throws waException
     */
    public function add(tasksApiTasksAddRequest $addRequest): tasksTaskObj
    {
        if (!tsks()->getRightResolver()->contactCanAccessToProject(wa()->getUser(), $addRequest->getProjectId())) {
            throw new tasksAccessException();
        }



        $project = tsks()->getEntityFactory(tasksTaskObj::class)->createFromApiVo($addRequest);

        $statuses = tasksHelper::getStatuses(null, false);
        $newStatuses = [];
        foreach ($statuses as $s) {
            if (empty($s['special']) && !empty($addRequest->getWorkflow()[$s['id']])) {
                $newStatuses[$s['id']] = $s['id'];
            }
        }

        if (!tsks()->getEntityRepository(tasksTasks::class)->save($project, $newStatuses)) {
            throw new tasksException('Error on project add');
        }

        return $project;
    }
}
