<?php

class tasksFieldsSaveController extends waJsonController
{
    public function execute()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }

        $fields = $this->getRequest()->post('fields', [], waRequest::TYPE_ARRAY);
        if (!is_array($fields) || empty($fields)) {
            return;
        }

        $sort = 0;
        foreach ($fields as $key => &$_field) {
            if ($key === '_template_') {
                unset($fields[$key]);
                continue;
            }
            $_field['sort'] = $sort++;
            $_field['data'] = ifset($_field, 'data', []);
        }
        unset($sort, $key, $_field);

        $type_field_links = [];
        $fields = (new tasksFieldModel())->saveFields($fields);
        foreach ($fields as $_field) {
            if (!empty($_field['type_link']) && !empty($_field['id'])) {
                foreach ($_field['type_link'] as $_link) {
                    $type_field_links[] = [
                        'type_id'  => $_link,
                        'field_id' => $_field['id'],
                    ];
                }
            }
        }

        $result = $fields && (new tasksTypeFieldModel())->save($type_field_links);

        $this->response = $result;
    }
}
