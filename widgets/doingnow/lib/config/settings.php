<?php
return [
    'title' => [
        'title' => /*_wp*/('Title'),
        'control_type' => waHtmlControl::INPUT,
    ],
    'group' => [
        'title' => /*_wp*/('Team'),
        'control_type' => waHtmlControl::CUSTOM . ' ' . 'tasksDoingnowWidget::getGroupFilterControl',
    ],
];
