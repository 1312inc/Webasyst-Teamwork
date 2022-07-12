<?php

final class tasksLicenseCheckerService
{
    private const FAIL_TTL = 30 * 60;
    private const OK_TTL = 60 * 60 * 24;
    private const CACHE_KEY = 'license_check_result';

    public function hasLicense(): bool
    {
        if (!wa()->appExists('installer')) {
            return true;
        }

        $result = tsks()->getCache()->get(self::CACHE_KEY);
        if ($result === null) {
            wa('installer');

            $license = installerHelper::checkLicense(tasksConfig::APP_ID);
            if ($license['status'] === false) {
                $result = false;
            } elseif (empty($license['expire_date'])) {
                $result = true;
            } elseif ($license['expire_date'] < date('Y-m-d')) {
                $result = false;
            } else {
                $result = true;
            }

            tsks()->getCache()->set(self::CACHE_KEY, $result, $result === false ? self::FAIL_TTL : self::OK_TTL);
        }

        return $result;
    }
}
