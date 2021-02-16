<?php

final class tasksApiProjectAddHandler
{
    /**
     * @param tasksApiProjectAddRequest $addRequest
     *
     * @return tasksProject
     * @throws tasksException
     */
    public function add(tasksApiProjectAddRequest $addRequest): tasksProject
    {
        $project = tsks()->getEntityFactory(tasksProject::class)->createFromApiVo($addRequest);

        $statuses = tasksHelper::getStatuses(null, false);
        $newStatuses = [];
        foreach ($statuses as $s) {
            if (empty($s['special']) && !empty($addRequest->getWorkflow()[$s['id']])) {
                $newStatuses[$s['id']] = $s['id'];
            }
        }
        if (!tsks()->getEntityRepository(tasksProject::class)->save($project, $newStatuses)) {
            throw new tasksException('Error on project save');
        }

        return $project;
    }
}
