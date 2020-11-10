<?php

class tasksDebugPlugin extends waPlugin
{
    public function backendSidebar()
    {
        $event = $this->getEvent();
        return array(
            'top_li' => $this->buildSpanLine($event, 'top_li'),
            'bottom_li' => $this->buildSpanLine($event, 'bottom_li'),
            'section' => $this->buildSpanLine($event, 'section')
        );
    }

    public function backendSettingsSidebar()
    {
        $event = $this->getEvent();
        return array(
            'top_li' => $this->buildSpanLine($event, 'top_li'),
            'section' => $this->buildSpanLine($event, 'section')
        );
    }

    public function backendAssets()
    {
        $result = '<style>.t-task-page-wrapper .t-task-page-block .t-more-fields-wrapper { display: block; } </style>';
        $this->logEvent();
        return $result;
    }

    public function backendTasks($params)
    {
        $event = $this->getEvent();
        $tasks_blocks = array();
        foreach ($params['tasks'] as $task) {
            $task_id = wa_is_int($task) ? $task : $task['id'];
            $task_blocks = $this->getTaskBlocks($task_id, $event);
            $tasks_blocks[$task_id] = $task_blocks;
        }
        $header_blocks = array(
            'top' => $this->buildSpanLine($event, 'header-top'),
            'filters' => array(
                $this->buildSpanLine($event, 'filters', '1', '1'),
                $this->buildSpanLine($event, 'filters', '2', '2'),
            ),
            'preview' => $this->buildSpanLine($event, 'preview'),
            'toolbar' => $this->buildSpanLine($event, 'toolbar'),
            'order_items' => array(
                array(
                    'id' => "{$event}-item-1",
                    'name' => "{$event}-item-1"
                ),
                array(
                    'id' => "{$event}-item-2",
                    'name' => "{$event}-item-2"
                ),
            ),
            'bulk' => $this->buildSpanLine($event, 'bulk'),
            'bottom' => $this->buildSpanLine($event, 'header-bottom')
        );
        $body_blocks = array(
            'top' => $this->buildSpanLine($event, 'body-top'),
            'bottom' => $this->buildSpanLine($event, 'body-bottom'),
        );
        return array(
            'tasks' => $tasks_blocks,
            'header' => $header_blocks,
            'body' => $body_blocks
        );
    }

    public function backendTaskEdit($params)
    {
        $task = $params['task'];
        $event = $this->getEvent();

        $places = array(
            'before_header',
            'header',
            'after_header',
            'before_name',
            'name',
            'after_name',
            'before_description',
            'description',
            'after_description',
            'before_attachments',
            'attachments',
            'after_attachments',
            'before_buttons',
            'buttons',
            'after_buttons',
            'before_fields',
            'more',
            'after_fields'
        );
        $blocks = array();
        foreach ($places as $place) {
            $blocks[$place] = $this->buildDivLine($event, $place, 'id=' . $task['id']);
        }
        return $blocks;
    }

    public function backendTask($params)
    {
        $task = $params['task'];
        $task_id = wa_is_int($task) ? $task : $task['id'];
        return $this->getTaskBlocks($task_id, $this->getEvent());
    }

    public function backendListEdit($params)
    {
        $list = $params['list'];
        $event = $this->getEvent();
        return array(
            'more' => $this->buildSpanLine($event, 'more', 'id=' . $list['id'])
        );
    }

    public function backendMilestoneEdit($params)
    {
        $milestone = $params['milestone'];
        $event = $this->getEvent();
        return array(
            'more' => $this->buildSpanLine($event, 'more', 'id=' . $milestone['id'])
        );
    }

    public function logEvent($params = null)
    {
        $event = $this->getEvent();
        $log_file = 'tasks/plugins/debug/debug.log';
        $lines = array(
            "Event triggered: '{$event}'",
            "Params: ",
            var_export($params, true)
        );
        waLog::log(join(PHP_EOL, $lines), $log_file);
    }

    protected function getTaskBlocks($task_id, $event)
    {
        $places = array(
            'before_header',
            'header',
            'after_header',
            'before_description',
            'description',
            'after_description',
            'before_attachments',
            'attachments',
            'after_attachments',
            'before_quote_header',
            'quote_header',
            'after_quote_attachments',
            'before_quote_description',
            'quote_description',
            'after_quote_description',
            'before_quote_attachments',
            'quote_attachments',
            'after_quote_attachments',
            'before_buttons',
            'buttons',
            'after_buttons',
            'before_hidden_block',
            'hidden_block',
            'after_hidden_block'
        );
        $blocks = array();
        foreach ($places as $place) {
            $blocks[$place] = $this->buildDivLine($event, $place, $task_id);
        }
        return $blocks;
    }

    protected function buildSpanLine($event, $place, $title_suffix = '', $text_suffix = '')
    {
        $title = "{$event}::{$place}";
        if ($title_suffix) {
            $title .= "::{$title_suffix}";
        }
        $text = $place;
        if ($text_suffix) {
            $text .= '-' . $text_suffix;
        }
        return "<span title=\"{$title}\" style=\"color:red; font-weight: bold; \">*{$text}*</span>";
    }

    protected function buildDivLine($event, $place, $title_suffix = '', $text_suffix = '')
    {
        $title = "{$event}::{$place}";
        if ($title_suffix) {
            $title .= "::{$title_suffix}";
        }
        $text = $place;
        if ($text_suffix) {
            $text .= '-' . $text_suffix;
        }
        return "<div title=\"{$title}\" style=\"color:red; font-weight: bold; margin: 10px 0;\">*{$text}*</div>";
    }

    protected function getEvent()
    {
        $event = '';
        foreach (debug_backtrace() as $item) {
            if ($item['function'] === 'event' && $item['class'] === 'waSystem') {
                $event = current($item['args']);
                break;
            }
        }
        return $event;
    }
}
