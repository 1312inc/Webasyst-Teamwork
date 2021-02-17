<?php

/**
 * Interface tasksApiResponseInterface
 */
interface tasksApiResponseInterface
{
    const HTTP_OK = 200;

    /**
     * @return int
     */
    public function getStatus(): int;

    public function getResponseBody();
}
