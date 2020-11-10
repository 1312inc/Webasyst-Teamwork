<?php
return array(
    'tasks_supervisor' => array(
        'contact_id' => array('int', 11, 'null' => 0),
        'task_id' => array('int', 11, 'null' => 0),
        ':keys' => array(
            'PRIMARY' => array('contact_id', 'task_id'),
            'task_id' => 'task_id',
        ),
    ),
);
