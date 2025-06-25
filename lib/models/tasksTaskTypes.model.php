<?php

class tasksTaskTypesModel extends waModel
{
    const DEFAULT_COLOR = '999';
    protected $table = 'tasks_task_types';

    public function getAll($key = null, $normalize = false)
    {
        return $this->select('*')
            ->order('sort')
            ->fetchAll($key, $normalize);
    }

    public function getTypes()
    {
        $types = $this->getAll('id');
        foreach ($types as &$type) {
            $type['color'] = $type['color'] === null ? self::DEFAULT_COLOR : $type['color'];
        }
        unset($type);

        return $types;
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
            $id = 't' . date('Ymd');
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

    public function saveTypes($types)
    {
        $all_types = $this->getAll('id');
        $empty = $this->getEmptyRow();
        foreach ($types as $type) {
            $default = isset($all_types[$type['id']]) ? $all_types[$type['id']] : $empty;
            $type = array_merge($default, $type);
            if ($this->isHexColorCode($type['color'])) {
                $type['color'] = strtolower($type['color']);
            } else {
                $type['color'] = null;
            }
            $this->insert($type, 1);
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
        $tem = new tasksTaskExtModel();
        $tem->updateByField('type', $ids, ['type' => null]);
        $tem->cleanEmptyRows();
    }
}
