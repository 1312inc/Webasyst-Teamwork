<?php

$utf8mb4 = new tasksUtf8mb4Converter();
foreach ($utf8mb4->getTables() as $table => $columns) {
    foreach ($columns as $column) {
        try {
            $utf8mb4->convertColumn($table, $column);
        } catch (Exception $e) {
            waLog::log($e->getMessage());
        }
    }
}
