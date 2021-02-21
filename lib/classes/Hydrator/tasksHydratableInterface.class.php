<?php

/**
 * Interface tasksHydratableInterface
 */
interface tasksHydratableInterface
{
    /**
     * Должен вернуть массив с ключами именами столбцов, а значениями - сконвертированными из сущности в представление бд
     *
     * @param array $fields
     *
     * @return array
     */
    public function convertToSqlValues(array $fields): array;

    /**
     * Подготавливает данные из бд для сеттеров в сущность
     *
     * @param array $dbValues
     *
     * @return void
     */
    public function convertToPhpValues(array &$dbValues): void;
}
