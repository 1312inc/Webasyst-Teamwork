<?php

final class tasksPushSenderService
{
    /**
     * @var tasksOnesignalPushService|null
     */
    private $pushAdapter;

    /**
     * @var string|null
     */
    private $waInstallationId;

    public function __construct()
    {
        try {
            $onePushClass = 'wa-system/push/adapters/onesignal/onesignalPush.class.php';
            if (!class_exists('onesignalPush')
                && file_exists(wa()->getConfig()->getRootPath() . '/' . $onePushClass)
            ) {
                waAutoload::getInstance()->add('onesignalPush', $onePushClass);
            }

            $this->pushAdapter = new tasksOnesignalPushService(tasksOptions::getOneSignalAppId());
        } catch (waException $e) {
            tasksLogger::debug('Unable to load wa-system/push/adapters/onesignal/onesignalPush.class.php');
        }

        $waidCredentials = (new waAppSettingsModel())->get('webasyst', 'waid_credentials');
        $waidCredentials = json_decode($waidCredentials, true);
        $this->waInstallationId = $waidCredentials['client_id'] ?? null;
    }

    /**
     * @throws waException
     */
    public function send(string $type, $task, array $logItem, waContact $toContact): void
    {
        tasksLogger::debug(
            sprintf(
                'Start to send push notifications about task "%s" to contact %s (%s)',
                $task['name'] ?? '',
                $toContact->getName(),
                $toContact->getId()
            )
        );

        if (!$this->pushAdapter || !$this->pushAdapter->isEnabled()) {
            tasksLogger::debug('Push adapter is not initialized or is not enables');

            return;
        }

        $dto = new tasksPushDataDto(
            $this->getTitle($type, $task),
            $this->getMessage($type, $task, $toContact, $logItem),
            null,
            [
                'task_id' => $task['id'],
                'type' => $type,
                'webasyst_installation_id' => $this->waInstallationId,
                'group_name' => sprintf(_w('%d.%d %s'), $task['project_id'] , $task['number'], $task['name']),
                'group_id' => sprintf('%s-%s', $this->waInstallationId, $task['id'])
            ],
            null
        );

        tasksLogger::debug($dto->toArray());

        $this->pushAdapter->sendByContact($toContact->getId(), $dto);
    }

    private function getMessage(string $type, $task, waContact $to, $log): string
    {
        $log['assigned_contact'] = new waContact($log['assigned_contact_id']);
        if (!$log['assigned_contact']->exists()) {
            $log['assigned_contact'] = null;
        }

        if (trim($log['text']) !== '') {
            $logText = $this->prepare(tasksHelper::convertToMarkdownAndStripTags($log['text'], 256));

            return sprintf('%s: %s', wa()->getUser()->getName(), $this->prepare($logText));
        }

        switch ($type) {
            case tasksNotificationsSender::EVENT_NEW:
                if ($to->getId() == $log['assigned_contact_id']) {
                    if ($to->getId() == $task['create_contact_id']) {
                        /* MUST NEVER HAPPEN, BUT JUST IN CASE  */
                        return sprintf('User %s sent you your task', wa()->getUser()->getName());
                    }

                    return sprintf('User %s sent you a new task', wa()->getUser()->getName());
                }

                $_assigned_contact = $log['assigned_contact']?:null;
                if ($_assigned_contact) {
                    return sprintf(
                        'User %s sent a new task to user %s',
                        wa()->getUser()->getName(),
                        $_assigned_contact->getName()
                    );
                }

                return sprintf('User %s sent a new task to user %s', wa()->getUser()->getName(), 'contact with id = ');

            case tasksNotificationsSender::EVENT_INVITE_ASSIGN:
                return sprintf_wp('User %s sent you a task', wa()->getUser()->getName());

            case tasksNotificationsSender::EVENT_ASSIGN:
                if ($to->getId() == $log['assigned_contact_id']) {
                    if ($to->getId() == $task['create_contact_id']) {
                        return sprintf_wp('User %s sent you your task',  wa()->getUser()->getName());
                    }

                    return sprintf_wp('User %s sent you a task', wa()->getUser()->getName());
                }

                $_assigned_contact = $log['assigned_contact'] ?: null;
                if ($_assigned_contact) {
                    return sprintf_wp('User %s sent a task to %s', wa()->getUser()->getName(), $_assigned_contact->getName());
                }

                return sprintf_wp('User %s sent a task to %s.', wa()->getUser()->getName(), 'contact with id = ');

            case tasksNotificationsSender::EVENT_DONE:
                return sprintf_wp('User %s has just completed a task', wa()->getUser()->getName());

            case tasksNotificationsSender::EVENT_COMMENT:
                if ($to->getId() == $log['assigned_contact_id']) {
                    return sprintf_wp(
                        'User %s wrote a comment to a task you are assigned to',
                        wa()->getUser()->getName()
                    );
                }

                if ($to->getId() == $task['create_contact_id']) {
                    return sprintf_wp('User %s wrote a comment to a task you created', wa()->getUser()->getName());
                }

                return sprintf_wp('User %s wrote a comment.', wa()->getUser()->getName());

            case tasksNotificationsSender::EVENT_EDIT:
                if ($to->getId() == $log['assigned_contact_id']) {
                    return sprintf_wp('User %s edited a task you are assigned to', wa()->getUser()->getName());
                }

                if ($to->getId() == $task['create_contact_id']) {
                    return sprintf_wp('User %s edited a task you created', wa()->getUser()->getName());
                }

                return sprintf_wp('User %s edited a task', wa()->getUser()->getName());

            default:
                return $type;
        }
    }

    private function prepare(string $str): string
    {
        return trim(preg_replace("/\n+/mu", '', preg_replace('/\s+/mu', ' ', $str)));
    }

    private function getTitle(string $type, $task): string
    {
        switch ($type) {
            case tasksNotificationsSender::EVENT_NEW:
                return sprintf(_w('%s %s'), $task['project_id'] . '.' . $task['number'], $task['name']);

            case tasksNotificationsSender::EVENT_ASSIGN:
                return sprintf('➡️ ' . _w('%s %s'), $task['project_id'] . '.' . $task['number'], $task['name']);

            case tasksNotificationsSender::EVENT_DONE:
                return sprintf('☑️️ ' . _w('%s %s'), $task['project_id'] . '.' . $task['number'], $task['name']);

            case tasksNotificationsSender::EVENT_COMMENT:
            case tasksNotificationsSender::EVENT_EDIT:
            default:
                return sprintf('⚡ ' . _w('%s %s'), $task['project_id'] . '.' . $task['number'], $task['name']);
        }
    }
}
