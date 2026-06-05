<?php

class tasksTaskRepeatModel extends waModel
{
    protected $table = 'tasks_task_repeat';
    protected $id = 'task_id';

    public function saveRepeat(int $task_id, array $repeat, ?string $repeat_date_base)
    {
        $mode = ifset($repeat, 'mode', '');
        if ($mode !== 'on_due' && $mode !== 'on_complete') {
            $this->deleteById($task_id);
            return;
        }

        $row = [
            'task_id' => $task_id,
            'mode' => $mode,
            'frequency' => max(1, (int) ifset($repeat, 'frequency', 1)),
            'interval' => ifset($repeat, 'interval', 'day'),
            'repeat_date' => ifset($repeat, 'repeat_date', null),
        ];

        $intervals = [
            'day' => 'D',
            'week' => 'W',
            'month' => 'M',
            'year' => 'Y',
        ];

        if (!isset($intervals[$row['interval']])) {
            $row['interval'] = 'day';
        }

        if (!$row['repeat_date'] && $repeat_date_base) {
            $date = new DateTime($repeat_date_base);
            $date->add(new DateInterval('P'.$row['frequency'].$intervals[$row['interval']]));
            $row['repeat_date'] = $date->format('Y-m-d');
        }

        $this->replace($row);
    }
}
