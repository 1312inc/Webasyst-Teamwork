<?php

final class tasksApiTasksFavoriteHandler
{
    /**
     * @throws tasksResourceNotFoundException
     * @throws waException
     * @throws tasksAccessException
     */
    public function favorite(tasksApiTasksFavoriteRequest $favoriteRequest): bool
    {
        $task = tsks()->getModel(tasksTask::class)
            ->getById($favoriteRequest->getTaskId());

        if (!$task) {
            throw new tasksResourceNotFoundException(_w('Task not found'));
        }

        $contact = new waContact($favoriteRequest->getContactId());
        if (!$contact->exists()) {
            throw new tasksResourceNotFoundException(_w('Contact not found'));
        }

        $rights = new tasksRights();
        if (!$rights->canEditTask($task, wa()->getUser())) {
            throw new tasksAccessException(_w('You cannot edit task'));
        }

        if (!$rights->canViewTask($task, $contact)) {
            throw new tasksAccessException(_w('Contact cannot view task'));
        }

        return (bool) (new tasksFavoriteModel())
            ->changeFavorite($contact->getId(), $favoriteRequest->getTaskId(), $favoriteRequest->isFavorite());
    }
}
