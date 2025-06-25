<?php

class tasksTypesDeleteController extends waJsonController
{
    public function execute()
    {
        $this->accessDeniedForNotAdmin();
        $model = new tasksTaskTypesModel();
        $model->delete($this->getRequest()->post('id'));
    }

    protected function accessDeniedForNotAdmin()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }
    }
}
