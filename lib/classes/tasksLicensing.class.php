<?php

/**
 * Class tasksLicensing
 */
class tasksLicensing
{
    /**
     * @return bool
     * @throws waDbException
     * @throws waException
     */
    public static function isPremium()
    {
        $is_premium = wa()->getSetting('license_premium', '', 'tasks');
        if ($is_premium) {
            return true;
        }

        if (waLicensing::check('tasks')->hasPremiumLicense()) {
            $app_settings = new waAppSettingsModel();
            $app_settings->set('tasks', 'license_premium', date('Y-m-d H:i:s'));
            return true;
        }

        return false;
    }
}
