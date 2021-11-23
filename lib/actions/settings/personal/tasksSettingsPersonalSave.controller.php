<?php

class tasksSettingsPersonalSaveController extends waJsonController
{
    public function execute()
    {
        $settings = $this->getRequest()->post('settings');
        $this->getConfig()->setPersonalNotificationSettings($settings);
        wa()->getUser()->setSettings('tasks', 'text_editor', $settings['text_editor'] ?? 'wysiwyg');
    }
}

