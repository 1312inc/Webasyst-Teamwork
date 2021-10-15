<?php

class tasksRightConfig extends waRightConfig
{
    public const RIGHT_NOACCESS = 0;
    public const RIGHT_ASSIGNED = 1;
    public const RIGHT_FULL     = 2;

    public function init()
    {
        $project_model = new tasksProjectModel();
        $projects = $project_model->select('id,name')->fetchAll('id', true);

        $this->addItem('project', _w('Can manage projects'), 'selectlist', [
            'items' => $projects,
            'position' => 'right',
            'options' => [
                self::RIGHT_NOACCESS => _w('No access'),
                self::RIGHT_ASSIGNED => _w('View assigned tasks only'),
                self::RIGHT_FULL => _w('Full access'),
            ],
            'hint1' => 'all_select',
        ]);

        /**
         * @event rights.config
         *
         * @param waRightConfig $this Rights setup object
         *
         * @return void
         */
        wa()->event('rights.config', $this);
    }
}
