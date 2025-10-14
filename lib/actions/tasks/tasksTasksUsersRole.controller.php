<?php

class tasksTasksUsersRoleController extends waJsonController
{
    public function execute()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }

        $action = $this->getRequest()->get('act', '', waRequest::TYPE_STRING_TRIM);

        switch ($action) {
            case 'add':
                $this->addUserRole();
                break;
            case 'remove':
                $this->deleteUserRole();
                break;
            default:
                $this->getUserRoles();
        }
    }

    private function getUserRoles()
    {
        $role_users = (new tasksRights())->getUsersAccessTask(tasksRights::PROJECT_ACCESS_VIEW_ASSIGNED_TASKS);
        foreach ($role_users as &$_user) {
            foreach (['name', 'firstname', 'middlename', 'title', 'company', 'jobtitle', 'about', 'login'] as $to_escape) {
                $_user[$to_escape] = htmlspecialchars((string) $_user[$to_escape]);
            }
            $_user['photo_url'] = waContact::getPhotoUrl($_user['id'] ?? 0, $_user['photo'] ?: null, 96, 96, 'person', true);
        }
        unset($_user);

        $this->response = array_values($role_users);
    }

    private function addUserRole()
    {
        $task_id = $this->getRequest()->post('task_id', null, waRequest::TYPE_INT);
        $user_id = $this->getRequest()->post('user_id', null, waRequest::TYPE_INT);
        $role_id = $this->getRequest()->post('role_id', null, waRequest::TYPE_STRING_TRIM);

        $task = tsks()->getModel(tasksTask::class)->getById($task_id);
        if (!$task) {
            throw new tasksResourceNotFoundException(_w('Task not found'));
        }

        $contact = new waContact($user_id);
        if (!$contact->exists()) {
            throw new tasksResourceNotFoundException(_w('Contact not found'));
        }

        $role = (new tasksTasksUserRoleModel())->getById($role_id);
        if (!$role) {
            throw new tasksAccessException(_w('Unknown role'));
        }

        $this->response = (bool) (new tasksTaskUsersModel())->addUserRole($task_id, $user_id, $role_id);
    }

    private function deleteUserRole()
    {
        $task_id = $this->getRequest()->post('task_id', null, waRequest::TYPE_INT);
        $user_id = $this->getRequest()->post('user_id', null, waRequest::TYPE_INT);
        $role_id = $this->getRequest()->post('role_id', null, waRequest::TYPE_STRING_TRIM);

        $this->response = (bool) (new tasksTaskUsersModel())->deleteByField([
            'task_id' => $task_id,
            'contact_id' => $user_id,
            'role_id' => $role_id
        ]);
    }
}
