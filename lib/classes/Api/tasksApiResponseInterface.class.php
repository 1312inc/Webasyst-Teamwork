<?php

/**
 * Interface tasksApiResponseInterface
 */
interface tasksApiResponseInterface
{
    public const HTTP_OK = 200;
    public const HTTP_FAIL = 400;

    public const RESPONSE_OK = 'ok';
    public const RESPONSE_FAIL = 'fail';

    /**
     * @return int
     */
    public function getStatus(): int;

    public function getResponseBody();
}
