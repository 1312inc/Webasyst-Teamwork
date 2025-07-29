<?php

class tasksTypesSaveController extends waJsonController
{
    public function execute()
    {
        $this->accessDeniedForNotAdmin();
        $model = new tasksTaskTypesModel();
        $model->saveTypes($this->getTypes());
    }

    protected function getTypes()
    {
        $post = $this->getRequest()->post('data');
        $post = is_array($post) ? $post : [];

        $model = new tasksTaskTypesModel();

        $types = isset($post['type']) && is_array($post['type']) ? $post['type'] : [];

        $sort = 0;
        foreach ($types as $id => &$type) {
            $id = is_scalar($id) ? $id : '';
            $id = trim(strval($id));
            $name = isset($type['name']) && is_scalar($type['name']) ? $type['name'] : '';
            $name = trim(strval($name));

            if (strlen($id) <= 0 || strlen($name) <= 0) {
                unset($types[$id]);
                continue;
            }

            if (substr($id, 0, 10) === '_template_') {
                $id = $model->generateId($name);
            }

            $type['id'] = strip_tags($id);
            $type['name'] = $name;
            $type['sort'] = $sort++;
        }
        unset($type);

        $types = array_values($types);

        return $types;
    }

    protected function accessDeniedForNotAdmin()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }
    }
}
