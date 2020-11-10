<?php

return array(
    'title' => array(
        'title' => /*_wp*/('Title'),
        'description' => /*_wp*/(''),
        'value' => /*_wp*/('Tasks actors'),
        'control_type' => waHtmlControl::INPUT,
    ),
    'filter' => array(
        'title' => /*_wp*/('Filter'),
        'description' => /*_wp*/(''),
        'control_type' => waHtmlControl::CUSTOM . ' ' . 'tasksActorsWidget::getCustomFilterControl',
        'widget_id' => $this->id
    )
);
