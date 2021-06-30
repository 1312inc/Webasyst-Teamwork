<?php
$m = new tasksTaskModel();

try{
    $m->query('select uuid from tasks_task');
} catch (waException $exception){
    $m->query('alter table tasks_task add column uuid varchar(36) default null');
    foreach ($m->getAll() as $task) {
        $m->exec(
            'update tasks_task set uuid = s:uuid where id = i:id',
            ['id' => $task['id'], 'uuid' => tasksUuid4::generate()]
        );
    }
}
