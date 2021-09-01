<?php

/**
 * Interface tasksApiResponseInterface
 */
interface tasksApiResponseInterface
{
    public const HTTP_OK = 200;
    public const HTTP_FAIL = 400;

    /**
     * @return int
     */
    public function getStatus(): int;

    public function getResponseBody();
}
