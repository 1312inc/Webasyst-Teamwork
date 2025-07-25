<?php

class tasksTaskExtModel extends waModel
{
    const GRAVITY_BLOCKER = 'blocker';
    const GRAVITY_CRITICAL = 'critical';
    const GRAVITY_MAJOR = 'major';
    const GRAVITY_NORMAL = 'normal';
    const GRAVITY_MINOR = 'minor';

    const RESOLUTION_FIX = 'fix';
    const RESOLUTION_INVALID = 'invalid';
    const RESOLUTION_WONT_FIX = 'wont_fix';
    const RESOLUTION_DUPLICATE = 'duplicate';

    protected $table = 'tasks_task_ext';

    protected $id = 'task_id';

    public function save($data = array())
    {
        if (isset($data['task_id'])) {
            if (!wa_is_int($data['task_id']) || $data['task_id'] <= 0) {
                return false;
            }
        }

        if (empty($data['type']) || !in_array($data['type'], self::getTypes(false))) {
            $data['type'] = null;
        }

        if (empty($data['gravity']) || !in_array($data['gravity'], self::getGravities(false))) {
            $data['gravity'] = null;
        }

        if (empty($data['resolution']) || !in_array($data['resolution'], self::getResolutions(false))) {
            $data['resolution'] = null;
        }

        if (isset($data['timecosts_plan'])) {
            if (!wa_is_int($data['timecosts_plan'])) {
                $data['timecosts_plan'] = null;
            }
        }

        if (isset($data['timecosts_fact'])) {
            if (!wa_is_int($data['timecosts_fact'])) {
                $data['timecosts_fact'] = null;
            }
        }

        if (isset($data['affected_version'])) {
            if (!is_scalar($data['affected_version'])) {
                $data['affected_version'] = null;
            } else {
                $data['affected_version'] = (string)$data['affected_version'];
                if (strlen($data['affected_version']) == 0) {
                    $data['affected_version'] = null;
                }
            }
        }

        $data = array_merge($this->getEmptyRow(), $data);

        $nulls_count = 0;
        foreach ($data as $field => $value) {
            if ($value === null) {
                $nulls_count += 1;
            }
        }

        // all fields (except task_id, task_id is required) are null, so don't insert data
        if ($nulls_count == count($this->getMetadata()) - 1) {
            if ($this->getByField('task_id', $data['task_id'])) {
                $this->deleteByField('task_id', $data['task_id']);
            }
            return false;
        }

        return $this->insert($data, 1);
    }

    public function getEmptyRow()
    {
        $result = [];
        foreach ($this->getMetadata() as $fld_id => $fld) {
            if (isset($fld['default'])) {
                $result[$fld_id] = $fld['default'];
            } elseif (!isset($fld['null']) || $fld['null']) {
                $result[$fld_id] = null;
            } elseif ($fld['type'] === 'int') {
                $result[$fld_id] = 0;
            } else {
                $result[$fld_id] = '';
            }
        }

        return $result;
    }

    public function cleanEmptyRows()
    {
        $sql = "DELETE FROM `{$this->table}`
            WHERE
                `type` IS NULL AND
                `gravity` IS NULL AND
                `timecosts_plan` IS NULL AND
                `timecosts_fact` IS NULL AND
                `affected_version` IS NULL AND
                `resolution` IS NULL AND
                `kanban_color` IS NULL
            ";
        $this->exec($sql);
    }

    public static function getFieldNames()
    {
        return [
            'type'             => _w('Type'),
            'gravity'          => _w('Gravity'),
            'timecosts_plan'   => _w('Planned time costs'),
            'timecosts_fact'   => _w('Actual time costs'),
            'affected_version' => _w('Affected version'),
            'resolution'       => _w('Result'),
            'kanban_color'     => _w('Color')
        ];
    }

    public static function getTypes($with_names = true)
    {
        $m = new tasksTaskTypesModel();
        $types = $m->getAll('id', true);
        $types = waUtils::getFieldValues($types, 'name', true);
        if ($with_names) {
            return $types;
        }
        return array_keys($types);
    }

    public static function getGravities($with_names = true)
    {
        static $types = null;
        if (!$types) {
            $types = [
                self::GRAVITY_BLOCKER  => 'Blocker',
                self::GRAVITY_CRITICAL => 'Critical',
                self::GRAVITY_MAJOR    => 'Major',
                self::GRAVITY_NORMAL   => 'Normal',
                self::GRAVITY_MINOR    => 'Minor',
            ];
        }
        if ($with_names) {
            return $types;
        }
        return array_keys($types);
    }

    public static function getResolutions($with_names = true)
    {
        static $types = null;
        if (!$types) {
            $types = [
                self::RESOLUTION_FIX       => 'Fix',
                self::RESOLUTION_INVALID   => 'Invalid',
                self::RESOLUTION_WONT_FIX  => 'Wont fix',
                self::RESOLUTION_DUPLICATE => 'Duplicate'
            ];
        }
        if ($with_names) {
            return $types;
        }
        return array_keys($types);
    }
}
