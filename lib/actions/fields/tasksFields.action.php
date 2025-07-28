<?php

class tasksFieldsAction extends waViewAction
{
    public function execute()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }

        $field_model = new tasksFieldModel();
        $type_field_model = new tasksTypeFieldModel();
        $fields = $field_model->getAll();
        $type_field_links = $type_field_model->get();

        $fields[] = ['id' => '_template_', 'data' => ['values' => ['']]] + $field_model->getEmptyRow();

        $this->view->assign([
            'sidebar_html'     => (new tasksSettingsSidebarAction())->display(),
            'input_elements'   => tasksFieldModel::INPUT_ELEMENTS,
            'fields'           => $fields,
            'task_types'       => (new tasksTaskTypesModel())->getTypes(),
            'type_field_links' => $type_field_links
        ]);
    }
}
