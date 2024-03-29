<?php

class tasksDoingnowWidget extends tasksAbstractWidget
{
    /**
     * @var array
     */
    private static $groups;

    public function defaultAction(): void
    {
        $this->incognitoUser();

        $currentGroup = self::getSettingsGroup($this->id);
        $statuses = (new tasksApiStatusGetListHandler())->getStatuses();
        $allUsers = (new tasksTeamGetListMethod())->run();
        // фильтр по группам
        $users = array_filter(
            array_map(
                static function (tasksApiTeammateDetailsDto $user) use ($currentGroup, $statuses) {
                    if ($currentGroup['id'] === 0 || isset($user->getGroups()[$currentGroup['id']])) {
                        $arrayData = json_decode(
                            json_encode($user, JSON_UNESCAPED_SLASHES || JSON_UNESCAPED_UNICODE),
                            true
                        );
                        if (isset($arrayData['last_log'])) {
                            $arrayData['last_log']['after_status'] = $statuses[$arrayData['last_log']['after_status_id']] ?? [];
                            $arrayData['last_log']['before_status'] = $statuses[$arrayData['last_log']['before_status_id']] ?? [];
                        } else {
                            return false;
                        }

                        return $arrayData;
                    }

                    return false;
                },
                $allUsers->getResponseBody()['data']
            )
        );

        $this->display([
            'info' => $this->getInfo(),
            'current_group' => $currentGroup,
            'settings' => $this->getSettings(),
            'title' => empty($this->getSettings('title')) ? ( $currentGroup['id'] ? $currentGroup['name'] : _w('Latest on tasks') ) : $this->getSettings('title'),
            'locale' => wa()->getUser()->getLocale(),
            'url_root_absolute' => wa()->getRootUrl(true),
            'url_root' => wa()->getRootUrl(),
            'users' => $users,
        ]);

        $this->incognitoLogout();
    }

    public static function getGroupFilterControl($name, $params): string
    {
        $templatePath = sprintf('%s/templates/GroupsControl.html', dirname(__FILE__, 2));

        $widgetId = waRequest::get('id', true, waRequest::TYPE_INT);

        return self::renderTemplate($templatePath, [
            'name' => $name,
            'params' => $params,
            'widget' => wa()->getWidget($widgetId)->getInfo(),
            'groups' => self::getGroups(),
            'current_group' => $params['value'] ?: self::getSettingsGroup($widgetId)['id'],
        ]);
    }

    private static function getGroups(): array
    {
        if (self::$groups === null) {
            self::$groups = [
                0 => ['name' => _w('All users'), 'id' => 0],
            ];
            if (wa()->appExists('team')) {
                wa('team');
                foreach (teamHelper::getVisibleGroups() as $visibleGroup) {
                    self::$groups[(int) $visibleGroup['id']] = [
                        'name' => $visibleGroup['name'],
                        'id' => (int) $visibleGroup['id'],
                    ];
                }
            }
        }

        return self::$groups;
    }

    private static function getSettingsGroup($widgetId): array
    {
        $groups = self::getGroups();
        $settings = self::getSettingModel()->get($widgetId);
        $savedGroup = $settings['group'] ?? 0;

        return $groups[$savedGroup];
    }
}
