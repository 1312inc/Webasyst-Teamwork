<?php

final class tasksApiProjectAddHandler
{
    /**
     * @param tasksApiProjectAddRequest $addRequest
     *
     * @return tasksProject
     * @throws tasksAccessException
     * @throws tasksException
     * @throws waException
     */
    public function add(tasksApiProjectAddRequest $addRequest): tasksProject
    {
        if (!tsks()->getRightResolver()->contactCanAddProject(wa()->getUser())) {
            throw new tasksAccessException();
        }

        $project = tsks()->getEntityFactory(tasksProject::class)->createFromApiVo($addRequest);

        $statuses = tasksHelper::getStatuses(null, false);
        $newStatuses = [];
        foreach ($statuses as $s) {
            if (empty($s['special']) && !empty($addRequest->getWorkflow()[$s['id']])) {
                $newStatuses[$s['id']] = $s['id'];
            }
        }

        if (!tsks()->getEntityRepository(tasksProject::class)->save($project, $newStatuses)) {
            throw new tasksException('Error on project add');
        }

        if ($addRequest->getIconHash()) {
            $iconUrl = (new tasksProjectIconUploader())->uploadIcon($addRequest->getIconHash(), $project->getId());
            if ($iconUrl) {
                $project->setIcon($iconUrl);
                tsks()->getPersister()->save($project);
            }
        }

        return $project;
    }
}
