<?php

final class tasksApiTeamInviteToTaskHandler
{
    /**
     * @throws tasksAccessException
     * @throws tasksResourceNotFoundException|waException
     */
    public function invite(tasksApiTeamInviteToTaskRequest $request): tasksInviteResultDto
    {
        if (!wa()->getUser()->isAdmin(tasksConfig::APP_ID)) {
            throw new tasksAccessException(_w('Access denied'));
        }

        $repository = tsks()->getEntityRepository(tasksTask2::class);
        /** @var tasksTask2 $task2 */
        $task2 = $repository->findById($request->getTaskId());
        if (!$task2) {
            throw new tasksResourceNotFoundException('Task not found');
        }

        $inviteService = new tasksInviteService();

        $inviteResult = $inviteService->inviteToTask(
            $request->getEmail(),
            $request->getAccessRight(),
            $task2->getLegacyTask()
        );

        if ($inviteResult->getContactId()) {
            $task2->setAssignedContactId($inviteResult->getContactId());
            $repository->save($task2);
        }

        return $inviteResult;
    }
}
