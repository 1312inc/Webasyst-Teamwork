<?php
return [
    'title' => [
        'title' => /*_wp*/('Title'),
        'control_type' => waHtmlControl::INPUT,
    ],
    'group' => [
        'title' => /*_wp*/('User group'),
        'control_type' => waHtmlControl::CUSTOM . ' ' . 'tasksDoingnowWidget::getGroupFilterControl',
    ],
];
