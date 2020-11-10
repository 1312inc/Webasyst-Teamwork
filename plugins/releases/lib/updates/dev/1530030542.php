<?php

// create new table
$_table_name = 'tasks_releases_task_types';
$_installer = new tasksReleasesPluginInstaller();
$_installer->createTable($_table_name, 'releases');

$_model = new waModel();

// but we need check up first old table
$_old_table_name = 'tasks_releases_task_ext_types';
$_old_table_exists = false;
try {
    $_model->query("SELECT * FROM `{$_old_table_name}` WHERE 0");
    $_old_table_exists = true;
} catch (waDbException $e) {
}

// old table exits, so copy data from old table to new table, and drop old table
if ($_old_table_exists) {

    $_model->exec("
      INSERT IGNORE INTO `{$_table_name}` (`id`, `name`, `sort`) 
        SELECT `id`, `name`, `sort` FROM `{$_old_table_name}`");
    $_model->exec("DROP TABLE `{$_old_table_name}`");

} else {

    // fill by default values
    $_installer->fillPredefinedTypes();
}
