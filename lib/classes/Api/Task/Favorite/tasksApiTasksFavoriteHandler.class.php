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
        if (wa()->getUser()->getId() != $contact->getId() && !$rights->canViewTask($task, wa()->getUser())) {
            throw new tasksAccessException(_w('You cannot edit task'));
        }

        if (!$rights->canViewTask($task, $contact)) {
            throw new tasksAccessException(_w('Contact cannot view task'));
        }

        $result = (new tasksFavoriteModel())
            ->changeFavorite($contact->getId(), $favoriteRequest->getTaskId(), $favoriteRequest->isFavorite(), $favoriteRequest->isUnread());

        if ($result && $favoriteRequest->isFavorite()) {
            $sender = new tasksNotificationsSender($task, tasksNotificationsSender::EVENT_MENTION, ['mention_contact' => $contact]);
            $sender->send();
        }

        return (bool) $result;
    }
}
