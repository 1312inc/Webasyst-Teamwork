<?php

final class tasksOptions
{
    public static function getTasksPerPage(): int
    {
        return (int) tsks()->getOption('tasks_per_page');
    }

    public static function getTasksPriorities(): array
    {
        return tsks()->getOption('priorities');
    }

    public static function getLogsPerPage(): int
    {
        return (int) tsks()->getOption('logs_per_page');
    }

    public static function getTagsCloudCacheTtl(): int
    {
        return (int) tsks()->getOption('tags_cloud_cache_ttl');
    }

    public static function getBulkNotificationLimit(): int
    {
        return (int) tsks()->getOption('bulk_notifications_limit');
    }

    public static function getOneSignalAppId(): ?string
    {
        return tsks()->getOption('onesignal_app_id') ?: null;
    }

    public static function getApiTextStrippedTruncateLength(): int
    {
        return (int) tsks()->getOption('api_text_stripped_truncate_length');
    }

    public static function getApiLargePhotoSize(): int
    {
        return (int) tsks()->getOption('api_large_photo_size');
    }
}
