<?php

class tasksAccessException extends tasksException
{
    public function __construct($message = 'No access', Throwable $previous = null)
    {
        parent::__construct($message, 403, $previous);
    }
}
