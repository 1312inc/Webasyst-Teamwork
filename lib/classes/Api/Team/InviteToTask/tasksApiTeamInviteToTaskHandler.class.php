<?php

final class tasksApiTeamInviteToTaskHandler
{
    /**
     * @throws tasksAccessException
     * @throws tasksResourceNotFoundException
     */
    public function invite(tasksApiTeamInviteToTaskRequest $request): tasksInviteResultDto
    {
        $repository = tsks()->getEntityRepository(tasksTask2::class);
        /** @var tasksTask2 $task2 */
        $task2 = $repository->findById($request->getTaskId());
        if (!$task2) {
            throw new tasksResourceNotFoundException('Task not found');
        }

        $rights = new tasksRights();
        if (!$rights->canEditTask($task2->getLegacyTask())) {
            throw new tasksAccessException(_w('Access denied'));
        }

        $inviteService = new tasksInviteService();

        $inviteResult = $inviteService->inviteToTask($request->getEmail(), $request->getAccessRight(),$task2->getLegacyTask());

        if ($inviteResult->getContactId()) {
            $task2->setAssignedContactId($inviteResult->getContactId());
            $repository->save($task2);
        }

        return $inviteResult;
    }
}
