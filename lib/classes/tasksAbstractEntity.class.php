<?php

abstract class tasksAbstractEntity
{
    protected function convertToDateTime(string $name, array $data, string $format = 'Y-m-d H:i:s')
    {
        if (empty($data[$name])) {
            return false;
        }

        return DateTimeImmutable::createFromFormat($format, $data[$name]);
    }

    protected function convertFromDateTime(string $name, array $data, string $format = 'Y-m-d H:i:s'): void
    {
        if (empty($data[$name])) {
            return;
        }

        $this->$name = DateTimeImmutable::createFromFormat($format, $data[$name]);
    }
}
