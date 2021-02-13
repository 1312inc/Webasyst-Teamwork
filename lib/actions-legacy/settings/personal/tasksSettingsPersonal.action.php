<?php

class tasksSettingsPersonalAction extends waViewAction
{
    public function execute()
    {
        $this->view->assign(array(
            'projects' => tasksHelper::getProjects(),
            'settings' => $this->getConfig()->getPersonalSettings()
        ));
    }
}

