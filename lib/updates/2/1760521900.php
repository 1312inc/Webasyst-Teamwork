<?php

$sort = 0;
$data = [];
$default_roles = [
    'client' => 'Заказчик',
    'assistant' => 'Соисполнитель',
    'decision_maker' => 'ЛПР',
    'supervisor' => 'Супервайзер'
];

$model = new tasksTasksUserRoleModel();

foreach ($default_roles as $id => $role) {
    $data[] = [
        'id'    => $id,
        'name'  => $role,
        'color' => '777',
        'sort'  => $sort++
    ];
}
try {
    $model->multipleInsert($data);
} catch (waDbException $wdb_ex) {
}
