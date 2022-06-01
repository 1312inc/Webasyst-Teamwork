<?php

final class tasksApiTeamInviteToTaskHandler
{
    private const ACCESS_MINIMAL = 0;
    private const ACCESS_ALL_PROJECTS = 1;
    private const ACCESS_FULL = 2;

    /**
     * @return tasksInviteResultDto
     * @throws tasksAccessException
     * @throws tasksException
     * @throws tasksResourceNotFoundException
     * @throws waException
     */
    public function invite(tasksApiTeamInviteToTaskRequest $request): tasksInviteResultDto
    {
        if (!wa()->appExists('team')) {
            throw new tasksException('No team app for invite');
        }

        if (!wa()->getUser()->isAdmin(tasksConfig::APP_ID)) {
            throw new tasksAccessException(_w('Access denied'));
        }

        $repository = tsks()->getEntityRepository(tasksTask2::class);
        /** @var tasksTask2 $task2 */
        $task2 = $repository->findById($request->getTaskId());
        if (!$task2) {
            throw new tasksResourceNotFoundException('Task not found');
        }

        wa('team');
        if ($request->getEmail()) {
            $inviteResult = (new taskTeamInviteByEmail($request->getEmail()->getValue()))->invite();
        } else {
            $inviteResult = (new taskTeamInviteByPhone($request->getPhone()->getValue()))->invite();
        }

        if ($inviteResult->getContactId()) {
            $link = waAppTokensModel::getLink($inviteResult->getToken());
            $this->updateRights($task2->getLegacyTask(), $request->getAccessRight(), $inviteResult->getContactId());

            if ($request->getEmail()) {
                $sender = new tasksNotificationsSender(
                    $task2->getId(),
                    tasksNotificationsSender::EVENT_INVITE_ASSIGN,
                    ['templateData' => ['invite_link' => $link]]
                );
                try {
                    $sender->sendOne(tasksNotificationsSender::EVENT_INVITE_ASSIGN, $inviteResult->getContactId());
                } catch (waException $e) {
                    return new tasksInviteResultDto($inviteResult->getContactId(), _w('Email not send'), null);
                }
            }

            $task2->setAssignedContactId($inviteResult->getContactId());
            $repository->save($task2);
        }

        return $inviteResult;
    }

    private function updateRights(tasksTask $task, int $newContactAccessRights, int $contactId): void
    {
        $contactRightModel = new waContactRightsModel();
        $existingRights = $contactRightModel->get($contactId, tasksConfig::APP_ID);
        switch ($newContactAccessRights) {
            case self::ACCESS_ALL_PROJECTS:
                $contactRightModel->save(
                    $contactId,
                    tasksConfig::APP_ID,
                    tasksRightConfig::RIGHT_NAME_PROJECT . '.all',
                    tasksRights::PROJECT_ACCESS_FULL
                );

                if ($existingRights[tasksRightConfig::RIGHT_NAME_BACKEND] < tasksRightConfig::RIGHT_BACKEND_RESTRICTED) {
                    $contactRightModel->save(
                        $contactId,
                        tasksConfig::APP_ID,
                        tasksRightConfig::RIGHT_NAME_BACKEND,
                        tasksRightConfig::RIGHT_BACKEND_RESTRICTED
                    );
                }
                break;

            case self::ACCESS_FULL:
                $contactRightModel->save(
                    $contactId,
                    tasksConfig::APP_ID,
                    tasksRightConfig::RIGHT_NAME_BACKEND,
                    tasksRightConfig::RIGHT_BACKEND_FULL
                );
                break;

            case self::ACCESS_MINIMAL:
            default:
                if ($existingRights[tasksRightConfig::RIGHT_NAME_BACKEND] < tasksRightConfig::RIGHT_BACKEND_RESTRICTED) {
                    $contactRightModel->save(
                        $contactId,
                        tasksConfig::APP_ID,
                        tasksRightConfig::RIGHT_NAME_BACKEND,
                        tasksRightConfig::RIGHT_BACKEND_RESTRICTED
                    );
                    $contactRightModel->save(
                        $contactId,
                        tasksConfig::APP_ID,
                        tasksRightConfig::RIGHT_NAME_PROJECT . '.' . $task->project_id,
                        tasksRights::PROJECT_ACCESS_VIEW_ASSIGNED_TASKS
                    );
                }
                break;
        }
    }
}
