<?php

class tasksTaskRepeatModel extends waModel
{
    protected $table = 'tasks_task_repeat';
    protected $id = 'task_id';

    public function getTasksReadyToRepeat()
    {
        return $this->query("
            SELECT *
            FROM {$this->table} 
            WHERE repeat_date <= ?
        ", [date('Y-m-d')])->fetchAll('task_id');
    }

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
            'measure' => ifset($repeat, 'measure', 'day'),
            'repeat_date' => ifset($repeat, 'repeat_date', null),
        ];

        $measures = [
            'day' => 'D',
            'week' => 'W',
            'month' => 'M',
            'year' => 'Y',
        ];

        if (!isset($measures[$row['measure']])) {
            $row['measure'] = 'day';
        }

        if (!$row['repeat_date'] && $repeat_date_base) {
            $now = new DateTime();
            $date = new DateTime($repeat_date_base);
            $interval = new DateInterval('P'.$row['frequency'].$measures[$row['measure']]);
            while (true) {
                $date->add($interval);
                if ($date >= $now) {
                    // repeat_date is calculated so that repeat_date+interval is in future
                    // but repeat_date may be in the past in case $repeat_date_base is in the past
                    $date->sub($interval);
                    break;
                }
            }
            $row['repeat_date'] = $date->format('Y-m-d');
        }

        $this->replace($row);
    }
}
