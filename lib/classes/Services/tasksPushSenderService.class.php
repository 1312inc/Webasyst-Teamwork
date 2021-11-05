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

            $this->pushAdapter = new tasksOnesignalPushService();
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
                'Start to send push notifications about task %s to contact %s',
                $task['name'] ?? '',
                $toContact->getName()
            )
        );

        if (!$this->pushAdapter || !$this->pushAdapter->isEnabled()) {
            tasksLogger::debug('Push adapter is not initialized or is not enables. Go to system settings');

            return;
        }

        $dto = new tasksPushDataDto(
            $this->getMessage($type, $task),
            $this->getMessage($type, $task),
            null,
            [
                'task_id' => $task['id'],
                'type' => $type,
                'webasyst_installation_id' => $this->waInstallationId,
            ],
            null
        );

        tasksLogger::debug($dto);

        $this->pushAdapter->sendByContact($toContact->getId(), $dto);
    }

    private function getMessage(string $type, $task): string
    {
        switch ($type) {
            case tasksNotificationsSender::EVENT_NEW:
                return sprintf(_w('NEW: %s %s'), $task['project_id'] . '.' . $task['number'], $task['name']);

            case tasksNotificationsSender::EVENT_ASSIGN:
                return sprintf(
                    '➡️ ' . _w('ASSIGNED: %s %s'),
                    $task['project_id'] . '.' . $task['number'],
                    $task['name']
                );

            case tasksNotificationsSender::EVENT_DONE:
                return sprintf('☑️ ' . _w('DONE: %s was completed'), $task['project_id'] . '.' . $task['number']);

            case tasksNotificationsSender::EVENT_COMMENT:
            case tasksNotificationsSender::EVENT_EDIT:
            default:
                return sprintf('⚡ ' . _w('EDIT: %s was edited'), $task['project_id'] . '.' . $task['number']);
        }
    }

    private function getTitle(string $type, $task): string
    {
        switch ($type) {
            case tasksNotificationsSender::EVENT_NEW:
                return sprintf(_w('NEW: %s %s'), $task['project_id'] . '.' . $task['number'], $task['name']);

            case tasksNotificationsSender::EVENT_ASSIGN:
                return sprintf(
                    '➡️ ' . _w('ASSIGNED: %s %s'),
                    $task['project_id'] . '.' . $task['number'],
                    $task['name']
                );

            case tasksNotificationsSender::EVENT_DONE:
                return sprintf('☑️ ' . _w('DONE: %s was completed'), $task['project_id'] . '.' . $task['number']);

            case tasksNotificationsSender::EVENT_COMMENT:
            case tasksNotificationsSender::EVENT_EDIT:
            default:
                return sprintf('⚡ ' . _w('EDIT: %s was edited'), $task['project_id'] . '.' . $task['number']);
        }
    }
}
