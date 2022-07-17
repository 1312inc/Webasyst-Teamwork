<?php

final class tasksApiTasksPublicLinkHandler
{
    public function publish(tasksApiTasksPublicLinkRequest $request): string
    {
        $repository = tsks()->getEntityRepository(tasksTask2::class);
        /** @var tasksTask2 $task2 */
        $task2 = $repository->findById($request->getId());
        if (!$task2) {
            throw new tasksException('Not found', 404);
        }

        $rights = new tasksRights();
        if (!$rights->canEditTask($task2->getLegacyTask())) {
            throw new waRightsException(_w('Access denied'));
        }

        if ($request->isPublish()) {
            if (!$task2->getPublicHash()) {
                $task2->setPublicHash(tasksUuid4::generate());
                tsks()->getPersister()->save($task2);
            }

            return $task2->getPublicHash();
        }

        if ($task2->getPublicHash()) {
            $task2->setPublicHash(null);
            tsks()->getPersister()->save($task2);
        }

        return '';
    }
}
