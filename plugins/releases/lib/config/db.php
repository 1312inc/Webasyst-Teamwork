<?php

return array(
    'tasks_releases_task_ext' => array(
        'task_id' => array('int', 11, 'null' => 0),
        'type' => array('varchar', 32),
        'gravity' => array('varchar', 32),
        'timecosts_plan' => array('int', 11),
        'timecosts_fact' => array('int', 11),
        'affected_version' => array('varchar', 32),
        'resolution' => array('varchar', 32),
        ':keys' => array(
            'PRIMARY' => 'task_id',
            'type' => 'type',
            'gravity' => 'gravity',
            'resolution' => 'resolution'
        ),
    ),
    'tasks_releases_milestone_projects' => array(
        'milestone_id' => array('int', 11, 'null' => 0),
        'project_id' => array('int', 11, 'null' => 0),
        ':keys' => array(
            'PRIMARY' => array('milestone_id', 'project_id')
        )
    ),
    'tasks_releases_task_types' => array(
        'id' => array('varchar', 32, 'null' => 0),
        'name' => array('varchar', 32, 'null' => 0),
        'color' => array('varchar', 64),
        'sort' => array('int', 11, 'null' => 0, 'default' => '0'),
        ':keys' => array(
            'PRIMARY' => 'id'
        )
    )
);
