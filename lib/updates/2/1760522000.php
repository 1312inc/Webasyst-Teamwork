<?php

$sort = 0;
$data = [];
$default_roles = [
    'client' => 'Client',
    'assistant' => 'Assistant',
    'decision_maker' => 'Decision maker',
    'supervisor' => 'Supervisor'
];

$model = new tasksTasksUserRoleModel();

$model->delete(array_keys($default_roles));

foreach ($default_roles as $id => $role) {
    $data[] = [
        'id'    => $id,
        'name'  => $role,
        'color' => '777777',
        'sort'  => $sort++,
        'can_edit' => 1,
        'can_action' => 1,
        'can_comment' => 1,
        'can_delete' => 1,
        'show_inbox' => 1,
        'send_notifications' => 1
    ];
}
try {
    $model->multipleInsert($data);
} catch (waDbException $wdb_ex) {
}
