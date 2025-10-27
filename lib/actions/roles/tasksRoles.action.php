<?php

class tasksRolesAction extends waViewAction
{
    public function execute()
    {
        $this->accessDeniedForNotAdmin();
        $model = new tasksTasksUserRoleModel();
        $this->view->assign([
            'sidebar_html' => $this->getSidebarHtml(),
            'roles'        => $model->getRoles(),
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
