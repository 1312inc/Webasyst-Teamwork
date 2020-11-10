<?php

class tasksInstaller
{
    /**
     * @param string|array[] string $table
     * @param string|null $plugin_id
     */
    public function createTable($table, $plugin_id = null)
    {
        $tables = array_map('strval', (array)$table);
        if (empty($tables)) {
            return;
        }

        if ($plugin_id !== null) {
            $db_path = wa()->getAppPath("plugins/{$plugin_id}/lib/config/db.php", 'tasks');
        } else {
            $db_path = wa()->getAppPath('lib/config/db.php', 'tasks');
        }

        $db = array();
        if (file_exists($db_path)) {
            $db = include($db_path);
        }

        $db_partial = array();
        foreach ($tables as $table) {
            if (isset($db[$table])) {
                $db_partial[$table] = $db[$table];
            }
        }

        if (empty($db_partial)) {
            return;
        }

        $m = new waModel();
        $m->createSchema($db_partial);
    }

}
