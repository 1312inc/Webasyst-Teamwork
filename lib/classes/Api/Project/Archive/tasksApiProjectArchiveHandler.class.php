<?php

final class tasksApiProjectArchiveHandler
{
    /**
     * @param tasksApiProjectArchiveRequest $archiveRequest
     *
     * @return bool
     * @throws tasksException
     * @throws waException
     */
    public function archive(tasksApiProjectArchiveRequest $archiveRequest): bool
    {
        if (!tsks()->getRightResolver()->contactCanAddProject(wa()->getUser())) {
            throw new tasksException('Project not found', 404);
        }

        /** @var tasksProject $project */
        $project = tsks()->getEntityRepository(tasksProject::class)->findById($archiveRequest->getId());
        if (!$project) {
            throw new tasksException('Project not found', 404);
        }

        $project->setArchiveDatetime($archiveRequest->getArchiveDatetime());

        if (!tsks()->getEntityRepository(tasksProject::class)->save($project)) {
            throw new tasksException('Error on project update');
        }

        return true;
    }
}
