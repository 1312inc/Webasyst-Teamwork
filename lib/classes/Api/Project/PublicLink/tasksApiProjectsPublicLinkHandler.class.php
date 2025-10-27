<?php

final class tasksApiProjectsPublicLinkHandler
{
    public function publish(tasksApiProjectsPublicLinkRequest $request): ?array
    {
        $repository = tsks()->getEntityRepository(tasksProject::class);

        /** @var tasksProject $project */
        $project = $repository->findById($request->getId());
        if (!$project) {
            throw new tasksException('Not found', 404);
        }

        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }

        if ($request->isPublish()) {
            if (!$project->getPublicHash()) {
                $project->setPublicHash(tasksUuid4::generate());
                tsks()->getPersister()->save($project);
            }

            $urls = tasksHelper::getPublicLinks($project->getPublicHash(), 'project');
            if (empty($urls)) {
                throw new tasksException('No routing', 400);
            }

            return array_values($urls);
        }

        if ($project->getPublicHash()) {
            $project->setPublicHash(null);
            tsks()->getPersister()->save($project);
        }

        return null;
    }
}
