<?php

class tasksReleasesPluginTypesAction extends waViewAction
{
    public function execute()
    {
        $this->accessDeniedForNotAdmin();

        $model = new tasksReleasesPluginTaskTypesModel();

        $this->view->assign(array(
            'sidebar_html' => $this->getSidebarHtml(),
            'types' => $model->getTypes(),
            'empty' => $model->getEmptyRow()
        ));
    }

    protected function getSidebarHtml()
    {
        $sidebar = new tasksSettingsSidebarAction();
        return $sidebar->display();
    }

    protected function accessDeniedForNotAdmin()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }
    }
}
