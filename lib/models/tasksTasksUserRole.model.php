<?php

class tasksTasksUserRoleModel extends waModel
{
    const DEFAULT_COLOR = '999';

    protected $table = 'tasks_user_role';

    public function getAll($key = null, $normalize = false)
    {
        return $this->select('*')
            ->order('sort')
            ->fetchAll($key, $normalize);
    }

    public function getRoles()
    {
        return $this->getAll('id');
    }

    public function generateId($name, $unique = true)
    {
        $id = $name;
        $id = preg_replace('/\s+/', '-', $id);
        foreach (waLocale::getAll() as $lang) {
            $id = waLocale::transliterate($id, $lang);
        }
        $id = preg_replace('/[^a-zA-Z0-9_-]+/', '', $id);
        $id = strtolower($id);
        if (strlen($id) <= 0) {
            $id = 't'.date('Ymd');
        }
        if ($unique) {
            $id_base = $id;
            $counter = 1;
            while ($this->getById($id)) {
                $id = "{$id_base}_{$counter}";
                $counter++;
            }
        }

        return $id;
    }

    public function saveRoles($roles)
    {
        $all_roles = $this->getAll('id');
        $empty = $this->getEmptyRow();
        foreach ($roles as $role) {
            $default = isset($all_roles[$role['id']]) ? $all_roles[$role['id']] : $empty;
            $role = array_merge($default, $role);
            if ($this->isHexColorCode($role['color'])) {
                $role['color'] = strtolower($role['color']);
            } else {
                $role['color'] = null;
            }
            $this->insert($role, 1);
        }
    }

    protected function isHexColorCode($color)
    {
        if (!is_scalar($color)) {
            return false;
        }
        $color = trim((string) $color);
        $pattern = '/^[0-9A-Fa-f]{3}\b|[0-9A-Fa-f]{6}$/';

        return preg_match($pattern, $color);
    }

    public function delete($id)
    {
        $ids = tasksHelper::toStrArray($id);
        $this->deleteById($ids);
        $tum = new tasksTaskUsersModel();
        $tum->deleteByField('role_id', $ids);
    }
}
