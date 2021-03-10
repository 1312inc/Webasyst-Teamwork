<?php

/**
 * Interface tasksApiResponseInterface
 */
interface tasksApiResponseInterface
{
    public const HTTP_OK = 200;

    /**
     * @return int
     */
    public function getStatus(): int;

    public function getResponseBody();
}
