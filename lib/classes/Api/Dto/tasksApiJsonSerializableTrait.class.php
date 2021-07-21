<?php

trait tasksApiJsonSerializableTrait
{
    public function jsonSerialize(): array
    {
        $json = [];
        foreach (get_object_vars($this) as $var => $value) {
            $json[$var] = $value;
        }

        return $json;
    }
}
