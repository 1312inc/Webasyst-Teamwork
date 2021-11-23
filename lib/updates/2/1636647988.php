<?php
$m = new tasksTaskModel();

try {
    $m->exec('select uuid from tasks_task limit 1');
} catch (waException $exception) {
    $m->query('alter table tasks_task add column uuid varchar(36) default null');
    foreach ($m->select('id')
                 ->where(
                     'update_datetime > ? and uuid is null',
                     [date('Y-m-d 00:00:00', strtotime('-1 month'))]
                 )
                 ->fetchAll() as $task) {
        $m->exec(
            'update tasks_task set uuid = s:uuid where id = i:id',
            ['id' => $task['id'], 'uuid' => tasksUuid4::generate()]
        );
    }
}
