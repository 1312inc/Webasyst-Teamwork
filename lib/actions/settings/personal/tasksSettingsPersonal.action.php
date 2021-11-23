<?php

class tasksSettingsPersonalAction extends waViewAction
{
    public function execute()
    {
        $settings = $this->getConfig()->getPersonalNotificationSettings();

        $settings['text_editor'] = wa()->getUser()->getSettings('tasks', 'text_editor', 'wysiwyg');

        $this->view->assign([
            'projects' => tasksHelper::getProjects(),
            'settings' => $settings,
            'sidebar_html' => $this->getUser()->isAdmin('tasks') ? (new tasksSettingsSidebarAction())->display() : '',
        ]);
    }
}
