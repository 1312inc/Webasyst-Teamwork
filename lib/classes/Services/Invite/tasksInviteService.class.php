<?php

final class tasksInviteService
{
    public const ACCESS_MINIMAL      = 0;
    public const ACCESS_ALL_PROJECTS = 1;
    public const ACCESS_FULL         = 2;

    public function __construct()
    {
        if (!wa()->appExists('team')) {
            throw new tasksException('No team app for invite');
        }
    }

    public function inviteToTask(
        tasksValueEmail $email,
        int $newContactAccessRights,
        tasksTask $task
    ): tasksInviteResultDto {
        $contactInfo = $this->findUserByEmail($email->getEmail());
        $result = $this->validateContact($contactInfo);
        if ($result) {
            return $result;
        }

        $data = ['full_access' => false, 'task' => $task->id];

        if ($contactInfo) {
            $token = $this->createContactToken($contactInfo['id'], $data);
        } else {
            $token = $this->createContactByEmail($email->getEmail(), $data);
        }

        if (!$token) {
            return new tasksInviteResultDto(null, _w("Invitation token can't created"));
        }

        $this->ensureTokensLimit($token);

        $link = waAppTokensModel::getLink($token);

        $this->updateRights($task, $newContactAccessRights, (int) $token['contact_id']);

        $sender = new tasksNotificationsSender($task, 'inviteAssign', ['templateData' => ['invite_link' => $link]]);
        try {
            $sender->sendOne(tasksNotificationsSender::EVENT_INVITE_ASSIGN, $token['contact_id']);
        } catch (waException $e) {
            return new tasksInviteResultDto((int) $token['contact_id'], _w('Email not send'));
        }

        return new tasksInviteResultDto((int) $token['contact_id'], null);
    }

    private function sendEmail(string $toEmail, string $subject, string $content): bool
    {
        $res = true;
        try {
            $mailer = new waMailMessage($subject, $content, 'text/html');
            $mailer->setTo($toEmail);

            if (!$mailer->send()) {
                $res = false;
            }
        } catch (Exception $e) {
            $res = false;
            tasksLogger::error(sprintf('Error to send email "%s" to "%s": %s', $subject, $toEmail, $e->getMessage()));
        }

        return $res;
    }

    private function findUserByEmail(string $email): ?array
    {
        return (new waContactModel())->getByEmail($email);
    }

    private function validateContact(?array $contactInfo): ?tasksInviteResultDto
    {
        if ($contactInfo && $contactInfo['is_user']) {
            if ($contactInfo['is_user'] == -1 && $contactInfo['login']) {
                return new tasksInviteResultDto(null, _w('This contact was banned'));
            }

            return new tasksInviteResultDto(null, _w('Already in our team!'));
        }

        return null;
    }

    private function ensureTokensLimit(array $token): void
    {
        $atm = new waAppTokensModel();

        $condition = [
            'app_id' => 'team',
            'type' => 'user_invite',
            'contact_id' => $token['contact_id'],
        ];

        $tokens = $atm->query(
            sprintf(
                "SELECT token FROM %s
                    WHERE app_id = :app_id AND type = :type AND contact_id = :contact_id
                    ORDER BY create_datetime DESC
                    LIMIT %s",
                $atm->getTableName(),
                5
            ),
            $condition
        )->fetchAll(null, true);

        if ($tokens) {
            $atm->exec(
                sprintf(
                    "DELETE FROM %s 
                    WHERE app_id = :app_id AND type = :type AND contact_id = :contact_id AND token NOT IN (:tokens)",
                    $atm->getTableName()
                ),
                array_merge($condition, ['tokens' => $tokens])
            );
        }
    }

    private function createContactByEmail($email, $data = null, $createMethod = 'invite')
    {
        if (waConfig::get('is_template')) {
            return false;
        }

        $c = new waContact();
        $c->save([
            'email' => [$email],
            'login' => $email,
            'create_method' => $createMethod,
            'locale' => wa()->getLocale(),
        ]);

        if (!$c->getId()) {
            return false;
        }

        return $this->createContactToken($c->getId(), $data);
    }

    private function createContactToken($contactId, $data = null): ?array
    {
        if (waConfig::get('is_template')) {
            return null;
        }
        $app_tokens_model = new waAppTokensModel();

        return $app_tokens_model->add([
            'app_id' => 'team',
            'type' => 'user_invite',
            'contact_id' => $contactId,
            'create_contact_id' => wa()->getUser()->getId(),
            'expire_datetime' => date('Y-m-d H:i:s', time() + 3600 * 24 * 3),
            'create_datetime' => date('Y-m-d H:i:s'),
            'data' => json_encode($data),
        ]);
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
