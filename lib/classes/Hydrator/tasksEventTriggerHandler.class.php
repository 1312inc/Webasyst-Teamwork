<?php

final class tasksEventTriggerHandler
{
    public function triggerAdd(tasksTask2 $task): void
    {
        /**
         * @event task_save
         */
        $taskData = $task->toArray();
        $params = [
            'task' => $taskData,
            'type' => 'add',
        ];
        $this->trigger('task_save', $params);
    }

    private function trigger(string $name, array $params)
    {
        wa()->event($name, $params);
    }
}
