<?php

final class tasksApiProjectUpdateHandler
{
    /**
     * @param tasksApiProjectUpdateRequest $updateRequest
     *
     * @return tasksProject
     * @throws tasksException
     * @throws waException
     */
    public function update(tasksApiProjectUpdateRequest $updateRequest): tasksProject
    {
        if (!tsks()->getRightResolver()->contactCanAddProject(wa()->getUser())) {
            throw new tasksException('Project not found', 404);
        }

        /** @var tasksProject $project */
        $project = tsks()->getEntityRepository(tasksProject::class)->findById($updateRequest->getId());
        if (!$project) {
            throw new tasksException('Project not found', 404);
        }

        $project
            ->setIcon($updateRequest->getIconUrl() ?: $updateRequest->getIcon())
            ->setName($updateRequest->getName())
            ->setColor($updateRequest->getColor())
            ->setSort($updateRequest->getSort());

        $newStatuses = [];
        if ($updateRequest->getWorkflow()) {
            $statuses = tasksHelper::getStatuses(null, false);
            foreach ($statuses as $s) {
                if (empty($s['special']) && !empty($updateRequest->getWorkflow()[$s['id']])) {
                    $newStatuses[$s['id']] = $s['id'];
                }
            }
        }

        if ($updateRequest->getIconHash()) {
            $iconUrl = (new tasksProjectIconUploader())->uploadIcon($updateRequest->getIconHash(), $project->getId());
            if ($iconUrl) {
                $project->setIcon($iconUrl);
            }
        }

        if (!tsks()->getEntityRepository(tasksProject::class)->save($project, $newStatuses)) {
            throw new tasksException('Error on project update');
        }

        return $project;
    }
}
