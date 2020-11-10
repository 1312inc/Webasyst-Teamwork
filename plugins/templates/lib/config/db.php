<?php

return array(
    'tasks_templates_template' => array(
        'id' => array('int', 11, 'null' => 0, 'autoincrement' => 1),
        'contact_id' => array('int', 11, 'null' => 0),
        'name' => array('varchar', 255, 'null' => 0),
        'text' => array('mediumtext', 'null' => 0),
        'is_shared' => array('tinyint', 1, 'null' => 0, 'default' => '0'),
        'icon' => array('varchar', 255),
        ':keys' => array(
            'PRIMARY' => 'id',
            'contact_id' => 'contact_id'
        )
    )
);
