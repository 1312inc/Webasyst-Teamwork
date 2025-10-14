<?php

class tasksRolesSaveController extends waJsonController
{
    public function execute()
    {
        $post = $this->getRequest()->post('data');
        $post = is_array($post) ? $post : [];

        $this->accessDeniedForNotAdmin();
        $model = new tasksTasksUserRoleModel();

        $sort = 0;
        $roles = isset($post['role']) && is_array($post['role']) ? $post['role'] : [];

        foreach ($roles as $id => &$role) {
            $id = is_scalar($id) ? $id : '';
            $id = trim(strval($id));
            $name = isset($role['name']) && is_scalar($role['name']) ? $role['name'] : '';
            $name = trim(strval($name));

            if (strlen($id) <= 0 || strlen($name) <= 0) {
                unset($roles[$id]);
                continue;
            }

            if (substr($id, 0, 10) === '_template_') {
                $id = $model->generateId($name);
            }

            $role['id'] = strip_tags($id);
            $role['name'] = $name;
            $role['sort'] = $sort++;
        }
        unset($role);

        $roles = array_values($roles);

        $model->saveRoles($roles);
    }

    protected function accessDeniedForNotAdmin()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }
    }
}
