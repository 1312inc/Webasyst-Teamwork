<?php
$m = new tasksTaskModel();

foreach ($m->getAll() as $task) {
    if (empty($task['uuid'])) {
        $m->exec(
            'update tasks_task set uuid = s:uuid where id = i:id',
            ['id' => $task['id'], 'uuid' => tasksUuid4::generate()]
        );
    }
}
