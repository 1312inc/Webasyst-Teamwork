<?php

final class tasksLogger
{
    public static function log($msg): void
    {
        waLog::log($msg, 'tasks/tasks.log');
    }

    public static function debug($msg): void
    {
        if (!waSystemConfig::isDebug()) {
            return;
        }

        if (is_scalar($msg) || (is_object($msg) && method_exists($msg, '__toString'))) {
            self::log($msg);
        } else {
            waLog::dump($msg, 'tasks/tasks.log');
        }
    }

    public static function error($msg): void
    {
        $trace = '';
        if ($msg instanceof Exception) {
            $trace = $msg->getTraceAsString();
            $msg = $msg->getMessage();
        }
        self::log($msg);

        if ($trace) {
            self::log($trace);
        }
    }
}
