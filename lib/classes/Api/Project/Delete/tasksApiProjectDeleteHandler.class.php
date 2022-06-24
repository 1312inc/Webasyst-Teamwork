<?php

final class tasksApiProjectDeleteHandler
{
    /**
     * @param tasksApiProjectDeleteRequest $deleteRequest
     *
     * @return bool
     * @throws tasksException
     * @throws waException
     */
    public function delete(tasksApiProjectDeleteRequest $deleteRequest): bool
    {
        if (!tsks()->getRightResolver()->contactCanAddProject(wa()->getUser())) {
            throw new tasksAccessException('Not allowed');
        }

        /** @var tasksProject $project */
        $project = tsks()->getEntityRepository(tasksProject::class)->findById($deleteRequest->getId());
        if (!$project) {
            throw new tasksResourceNotFoundException('Project not found');
        }

        if (!tsks()->getEntityRepository(tasksProject::class)->delete($project)) {
            throw new tasksException('Error on project delete');
        }

        /**
         * @event project_delete
         *
         * @param array [string]mixed $params
         * @param array [string]array $params['id'] ID of deleting project
         *
         * @return void
         */
        $params = ['ids' => [$project->getId()]];
        wa()->event('project_delete', $params);

        waFiles::delete((new tasksProjectIconUploader())->getProjectIconsPath($project->getId()), true);

        return true;
    }
}
