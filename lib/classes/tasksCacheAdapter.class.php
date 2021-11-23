<?php

final class tasksCacheAdapter extends waFileCacheAdapter
{
    /**
     * @param mixed $key
     *
     * @return mixed|null
     */
    public function get($key)
    {
        if (waSystemConfig::isDebug()) {
            return null;
        }

        return parent::get($key);
    }

    /**
     * @param string      $key
     * @param mixed       $value
     * @param int|null    $expiration
     * @param string|null $group
     *
     * @return false|int
     */
    public function set($key, $value, $expiration = null, $group = null)
    {
        if (!waSystemConfig::isDebug()) {
            return parent::set($key, $value, $expiration, $group);
        }

        return 1;
    }
}
