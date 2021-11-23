<?php

class tasksResourceNotFoundException extends tasksException
{
    public function __construct($message = 'No access', Throwable $previous = null)
    {
        parent::__construct($message, 404, $previous);
    }
}
