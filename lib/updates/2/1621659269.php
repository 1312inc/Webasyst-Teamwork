<?php
$m = new tasksTaskModel();

foreach ($m->getAll() as $task) {
    if (empty($task['uuid'])) {
        $m->updateById($task['id'], ['uuid' => tasksUuid4::generate()]);
    }
}
