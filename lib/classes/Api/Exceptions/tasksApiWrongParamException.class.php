<?php

/**
 * Class cashApiWrongParamException
 */
class tasksApiWrongParamException extends waAPIException
{
    public function __construct(string $param, string $description)
    {
        parent::__construct(
            sprintf("Wrong param: '%s'", $param),
            sprintf("Wrong param: '%s'. %s", $param, $description),
            400
        );
    }
}
