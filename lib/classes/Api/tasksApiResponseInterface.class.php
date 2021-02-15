<?php

/**
 * Interface tasksApiResponseInterface
 */
interface tasksApiResponseInterface
{
    /**
     * @return int
     */
    public function getStatus(): int;

    public function getResponseBody();
}
