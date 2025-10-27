<?php

class tasksRolesDeleteController extends waJsonController
{
    public function execute()
    {
        $this->accessDeniedForNotAdmin();
        $model = new tasksTasksUserRoleModel();
        $model->delete($this->getRequest()->post('id'));
    }

    protected function accessDeniedForNotAdmin()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }
    }
}
