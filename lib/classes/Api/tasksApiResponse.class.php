<?php

final class tasksApiResponse extends cashApiAbstractResponse
{
    public function __construct($status = null, string $response = 'ok')
    {
        parent::__construct($status);

        $this->response = $response;
    }
}
