<?php

class tasksFieldsDeleteController extends waJsonController
{
    public function execute()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }

        $field_id = $this->getRequest()->post('id', 0, waRequest::TYPE_INT);

        if (empty($field_id) && $field_id < 1) {
            return;
        }

        $model = new tasksFieldModel();
        $this->response = $model->deleteFields([$field_id]);
    }
}
