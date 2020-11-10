<?php
return array(
    'tasks_per_page' => 30,
    'logs_per_page' => 30,

    // When performing mass operation with tasks,
    // we either send email notifications once per task,
    // or send a single notification about the whole operation.
    // When there are more tasks in bulk operation than this nubber,
    // single notification is sent.
    'bulk_notifications_limit' => 10,

    'project_colors' => array(
        't-white',
        't-gray',
        't-yellow',
        't-green',
        't-blue',
        't-red',
        't-purple',
    ),

    'project_icons' => array(
        'blog',
        'notebook',
        'lock',
        'lock-unlocked',
        'broom',
        'star',
        'livejournal',
        'contact',
        'lightning',
        'light-bulb',
        'pictures',
        'reports',
        'books',
        'marker',
        'lens',
        'alarm-clock',
        'animal-monkey',
        'anchor',
        'bean',
        'car',
        'disk',
        'cookie',
        'burn',
        'clapperboard',
        'bug',
        'clock',
        'cup',
        'home',
        'fruit',
        'luggage',
        'guitar',
        'smiley',
        'sport-soccer',
        'target',
        'medal',
        'phone',
        'store',
    ),

    'status_icons' => array(
        'status-green-tiny',
        'status-yellow-tiny',
        'status-red-tiny',
        'status-blue-tiny',
        'status-gray-tiny',
        'yes',
        'no',
        'broom',
    ),

    'priorities' => array(
        -1 => array(
            'name' => _w('Low'),
            'bg_color' => '#6179C7',
            'text_color' => '#999',
            'value' => -1,
        ),
        0 => array(
            'name' => _w('Normal'),
            'bg_color' => 'transparent',
            'text_color' => '#999',
            'value' => 0,
        ),
        1 => array(
            'name' => _w('High'),
            'bg_color' => '#FF0000',
            'text_color' => 'white',
            'value' => 1,
        ),
        2 => array(
            'name' => _w('Urgent'),
            'bg_color' => '#ff0000',
            'text_color' => 'white',
            'value' => 2,
        ),
    ),

    'format_name' => array(
        'firstname' => true,
        'middlename' => false,
        'lastname' => true
    ),

    // 10 min
    'tags_cloud_cache_ttl' => 600
);
