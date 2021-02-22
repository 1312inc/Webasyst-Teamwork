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

        $repository = tsks()->getEntityRepository(tasksProject::class);

        /** @var tasksProject $project */
        $project = $repository->findById($archiveRequest->getId());
        if (!$project) {
            throw new tasksException('Project not found', 404);
        }

        if ($archiveRequest->isArchive()) {
            $project->setArchiveDatetime($archiveRequest->getArchiveDatetime());
        } else {
            $project->setArchiveDatetime(null);
        }

        if (!$repository->save($project)) {
            throw new tasksException('Error on project update');
        }

        return true;
    }
}
