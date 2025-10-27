<?php

final class tasksApiMilestonesPublicLinkHandler
{
    public function publish(tasksApiMilestonesPublicLinkRequest $request): ?array
    {
        $repository = tsks()->getEntityRepository(tasksMilestone::class);

        /** @var tasksMilestone $milestone */
        $milestone = $repository->findById($request->getId());
        if (!$milestone) {
            throw new tasksException('Not found', 404);
        }

        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }

        if ($request->isPublish()) {
            if (!$milestone->getPublicHash()) {
                $milestone->setPublicHash(tasksUuid4::generate());
                tsks()->getPersister()->save($milestone);
            }

            $urls = tasksHelper::getPublicLinks($milestone->getPublicHash(), 'milestone');
            if (empty($urls)) {
                throw new tasksException('No routing', 400);
            }

            return array_values($urls);
        }

        if ($milestone->getPublicHash()) {
            $milestone->setPublicHash(null);
            tsks()->getPersister()->save($milestone);
        }

        return null;
    }
}
