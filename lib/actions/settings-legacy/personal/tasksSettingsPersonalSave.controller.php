<?php

class tasksSettingsPersonalSaveController extends waJsonController
{
    public function execute()
    {
        $settings = $this->getRequest()->post('settings');
        $this->getConfig()->setPersonalSettings($settings);
    }

}

