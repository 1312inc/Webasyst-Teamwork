<?php

class tasksRightConfig extends waRightConfig
{
    public const RIGHT_NAME_PROJECT = 'project';
    public const RIGHT_NAME_BACKEND = 'backend';

    public const RIGHT_BACKEND_RESTRICTED = 1;
    public const RIGHT_BACKEND_FULL = 2;

    public function init()
    {
        $project_model = new tasksProjectModel();
        $projects = $project_model->select('id,name')->fetchAll('id', true);

        $this->addItem(self::RIGHT_NAME_PROJECT, _w('Can manage projects'), 'selectlist', [
            'items' => $projects,
            'position' => 'right',
            'options' => [
                tasksRights::PROJECT_ACCESS_NONE => _w('No access'),
                tasksRights::PROJECT_ACCESS_VIEW_ASSIGNED_TASKS => _w('Self tasks only'),
                tasksRights::PROJECT_ACCESS_FULL => _w('Full access'),
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
