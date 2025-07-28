<?php

class tasksTypesAction extends waViewAction
{
    public function execute()
    {
        $this->accessDeniedForNotAdmin();
        $model = new tasksTaskTypesModel();
        $this->view->assign([
            'sidebar_html' => $this->getSidebarHtml(),
            'types'        => $model->getTypes(),
            'empty'        => $model->getEmptyRow()
        ]);
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
