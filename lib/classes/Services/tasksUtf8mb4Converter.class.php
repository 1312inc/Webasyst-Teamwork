<?php

/**
 * @see \webasystSettingsDatabaseConvertController
 */
final class tasksUtf8mb4Converter
{
    private const CHARSET = 'utf8mb4';
    private const COLLATION = 'utf8mb4_general_ci';

    /**
     * @var waModel
     */
    private $model;

    public function convertColumn(string $table, string $column): void
    {
        $table_name = $this->getModel()->escape($table);
        $table_columns = $this->getModel()->query('SHOW FULL COLUMNS FROM `'.$table_name.'`')->fetchAll('Field');

        $column_data = ifempty($table_columns, $column, null);
        if (empty($column_data)) {
            return;
        }

        if (empty($column_data['Collation'])) {
            return;
        }

        if ($column_data['Collation'] === self::COLLATION) {
            return;
        }

        $field = $column_data['Field'];
        $type = $column_data['Type'];

        $null = 'NULL';
        if (strtoupper($column_data['Null']) === 'NO') {
            $null = 'NOT NULL';
        }

        $default = $column_data['Default'];
        if ($default !== null) {
            if ($default == 'CURRENT_TIMESTAMP') {
                $default = "DEFAULT ".$default;
            } else {
                $default = "DEFAULT '{$this->getModel()->escape($default)}'";
            }
        }

        $sql = "ALTER TABLE `{$table}` MODIFY `{$field}` {$type} CHARACTER SET ".self::CHARSET." COLLATE ".self::COLLATION." {$null} {$default}";

        $this->getModel()->exec($sql);
    }

    public function getTables(): array
    {
        $tables = $this->getModel()->query('SHOW TABLE STATUS')->fetchAll('Name');
        $toConvert = [];

        foreach ($tables as $i => $table) {
            if (strpos($table['Name'], 'tasks_') === false) {
                continue;
            }

            $isConvertable = !empty($table['Collation']);
            if (!$isConvertable) {
                continue;
            }

            $isMb4 = (bool) preg_match('~^(utf8mb4_)~ui', $table['Collation']);
            $columns = $this->getModel()->query('SHOW FULL COLUMNS FROM `'.$table['Name'].'`')->fetchAll('Field');
            $indexes = $this->getModel()->query('SHOW INDEX FROM `'.$table['Name'].'`')->fetchAll('Column_name');

            $toConvert[$table['Name']] = $toConvert[$table['Name']] ?? [];

            foreach ($columns as $column) {
                $isMb4 = (bool) preg_match('~^(utf8mb4_)~ui', $column['Collation']);
//                if ($isMb4) {
//                    continue;
//                }
                $isIndex = isset($indexes[$column['Field']]);
                $isConvertable = !empty($column['Collation']);
                if (!$isConvertable || $isIndex) {
                    continue;
                }

                $toConvert[$table['Name']][] = $column['Field'];
            }
        }

        return array_filter($toConvert);
    }

    protected function getModel(): waModel
    {
        if (!$this->model) {
            $this->model = new waModel();
        }

        return $this->model;
    }
}