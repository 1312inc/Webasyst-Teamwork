<?php

final class tasksApiTasksPublicLinkHandler
{
    public function publish(tasksApiTasksPublicLinkRequest $request): ?array
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

            $urls = [];
            foreach (wa()->getRouting()->getDomains() as $domain) {
                $urls[] = wa()->getRouting()->getUrl('/frontend', ['public_hash' => $task2->getPublicHash()], true, $domain);
            }

            $urls = array_filter($urls);
            if (empty($urls)) {
                throw new tasksException('No routing', 400);
            }

            return array_values($urls);
        }

        if ($task2->getPublicHash()) {
            $task2->setPublicHash(null);
            tsks()->getPersister()->save($task2);
        }

        return null;
    }
}
