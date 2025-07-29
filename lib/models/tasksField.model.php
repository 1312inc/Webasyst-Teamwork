<?php

class tasksFieldModel extends waModel
{
    const INPUT_ELEMENTS = [
        'text',
        'radio',
        'checkbox',
        'color',
        'date',
        //'range',
        'time',
        'select',
        'textarea'
    ];

    protected $table = 'tasks_field';

    public function getAll($key = null, $normalize = false)
    {
        $fields = $this->select('*')
            ->order('sort')
            ->fetchAll($key, $normalize);

        foreach ($fields as &$_field) {
            if (empty($_field['data'])) {
                $_field['data'] = [];
            } else {
                $_field['data'] = self::decodeData($_field['data']);
            }
        }
        unset($_field);

        return $fields;
    }

    public function getByControls($controls = [])
    {
        $fields = [];
        $controls = array_intersect($controls, $this::INPUT_ELEMENTS);
        if ($controls) {
            $fields = $this->select('*')
                ->where('control IN (?)', [$controls])
                ->order('sort')
                ->fetchAll();

            foreach ($fields as &$_field) {
                if (empty($_field['data'])) {
                    $_field['data'] = [];
                } else {
                    $_field['data'] = self::decodeData($_field['data']);
                }
            }
            unset($_field);
        }

        return $fields;
    }

    public static function decodeData($data = '')
    {
        try {
            return waUtils::jsonDecode($data, true);
        } catch (Exception $e) {
            tasksLogger::error($e);
            return [];
        }
    }

    public static function encodeData($data = [])
    {
        try {
            return waUtils::jsonEncode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        } catch (Exception $e) {
            tasksLogger::error($e);
            return '';
        }
    }

    public static function getCode($name = '')
    {
        return preg_replace('/[^a-zA-Z0-9_]+/', '_', trim(strtolower(waLocale::transliterate($name))));
    }

    public function saveFields($fields = [])
    {
        $empty = $this->getEmptyRow();
        $all_fields = $this->getAll('id');
        foreach ($fields as &$_field) {
            $default = $empty;
            if (isset($_field['id'])) {
                $default = ifset($all_fields, $_field['id'], $empty);
            }
            $_field = array_merge($default, $_field);
            $_field['data'] = self::encodeData($_field['data']);
            if ($id = $this->insert($_field, self::INSERT_ON_DUPLICATE_KEY_UPDATE)) {
                $_field['id'] = $id;
            }
        }
        unset($_field);

        return $fields;
    }

    public function deleteFields($field_ids = [])
    {
        $ids = tasksHelper::toStrArray($field_ids);
        $this->deleteById($ids);
    }
}
