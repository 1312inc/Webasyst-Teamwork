<?php

//
// Give all non-admin users and groups with backend access to Tasks
// ability to view Updates and Kanban. This is a new access control checkbox.
// Everyone had access before v.3.2.4
//

$m = new waContactRightsModel();
$rows = $m->getByField([
    'app_id' => 'tasks',
    'name' => 'backend',
    'value' => 1,
], true);

$rows = array_map(function($row) {
    $row['name'] = 'kanban_log';
    return $row;
}, $rows);

$m->multipleInsert($rows, waModel::INSERT_IGNORE);
