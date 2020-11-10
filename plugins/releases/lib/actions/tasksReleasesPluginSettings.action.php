<?php

class tasksReleasesPluginSettingsAction extends waViewAction
{
    public function execute()
    {
        $statuses = tasksHelper::getStatuses();
        $plugin_instance = waSystem::getInstance()->getPlugin('releases');
        $show_statuses = $plugin_instance->getSettings('show_statuses');

        $this->view->assign('statuses', $statuses);
        $this->view->assign('show_statuses', $show_statuses);
    }

}