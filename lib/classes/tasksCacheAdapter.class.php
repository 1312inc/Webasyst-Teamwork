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
}
