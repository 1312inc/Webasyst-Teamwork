<?php

abstract class tasksAbstractWidget extends waWidget
{
    private $incognitoMode = false;

    /**
     * @var waWidgetSettingsModel
     */
    private static $settingsModel;

    protected static function renderTemplate($template, $assign = []): string
    {
        if (!file_exists($template)) {
            return '';
        }
        $assign['ui'] = wa()->whichUI(wa()->getConfig()->getApplication());

        $view = wa()->getView();
        $old_vars = $view->getVars();
        $view->clearAllAssign();
        $view->assign($assign);
        $html = $view->fetch($template);
        $view->clearAllAssign();
        $view->assign($old_vars);

        return $html;
    }

    protected static function getSettingModel(): waWidgetSettingsModel
    {
        if (self::$settingsModel === null) {
            self::$settingsModel = new waWidgetSettingsModel();
        }

        return self::$settingsModel;
    }

    protected function incognitoUser()
    {
        $user = wa()->getUser();
        $this->incognitoMode = !$user || !$user->isAuth();
        if ($this->incognitoMode) {
            $appAdmins = (new waContactRightsModel())->getUsers('tasks');
            wa()->getAuth()->auth(['id' => array_shift($appAdmins)]);
        }
    }

    protected function incognitoLogout(): void
    {
        if ($this->incognitoMode) {
            wa()->getAuth()->clearAuth();
        }
    }
}
