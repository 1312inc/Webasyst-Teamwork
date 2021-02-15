<?php

/**
 * Class cashApiMissingParamException
 */
class tasksApiMissingParamException extends waAPIException
{
    public function __construct($param)
    {
        parent::__construct(
            sprintf("Missing required param: '%s'", $param),
            sprintf("Missing required param: '%s'", $param),
            400
        );
    }
}
