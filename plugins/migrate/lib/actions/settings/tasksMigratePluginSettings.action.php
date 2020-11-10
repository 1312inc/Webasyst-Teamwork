<?php

class tasksMigratePluginSettingsAction extends waViewAction
{
    public function execute()
    {
        $this->view->assign('platform',waRequest::request('platform'));
        $this->view->assign('transports', tasksMigratePlugin::getTransports());
    }
}
