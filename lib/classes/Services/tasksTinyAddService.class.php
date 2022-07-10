<?php

/**
 * Проверяет можно ли показывать рекламу и вернет её если да
 */
final class tasksTinyAddService
{
    private const HIDE_FLAG = 'hide_tiny_ad_until';
    private const HIDE_FOR = '30 days';
    private const START_DATE = '2022-06-27';

    /**
     * @return array<string, mixed>
     * @throws waException
     */
    public function getAd(waContact $user): array
    {
        if (!$this->canShow($user)) {
            return [];
        }

        $_tinyAds[] = [
            'body' =>
                'hey there! please see the Sidebar.html for the one and the only Tasks mobile app tiny ad'
        ];

        //
        // if ( 0 ) {
        //     $_tinyAds[] = [
        //         'adtype' => 'app',
        //         'heading' => _w('Promocode'),
        //         'appurl' => $_webasyst_base_url . 'store/app/cash/?utm_source=statusappwebasyst&utm_medium=inapp_tiny_ad&utm_campaign=1312_inapp_statusappwebasyst_cashapp_wa' . $_whichUI,
        //         'buyurl' => $_webasyst_base_url . 'buy/store/5136/?utm_source=statusappwebasyst&utm_medium=inapp_tiny_ad&utm_campaign=1312_inapp_statusappwebasyst_cashapp_wa' . $_whichUI,
        //         'image' => wa()->getAppStaticUrl() . 'img/tinyad/ad-cash-app-144.png',
        //         'title' => _w('Cash Flow'),
        //         'subtitle' => _w('Forecasts and saves your business money.'),
        //         'teaser' => _w('Promocode for managing money the smarter way.'),
        //         'body' => '<strong>' . _w('Forecasts and saves your money.') . '</strong>' . ' ' .
        //             _w(
        //                 'Shows exact cash on hand balance for any date in the future. This app could have been a <em>life saver</em> for most businesses which did not survive a cash gap because of not knowing it’s coming.'
        //             ),
        //         'promocode' => '9ZYNJO6ENP',
        //         'discount' => '15',
        //     ];
        // }

        //show random tiny
        return $_tinyAds ? $_tinyAds[array_rand($_tinyAds)] : [];
    }

    public function setHideFlagForUser(waContact $user): void
    {
        $user->setSettings(
            tasksConfig::APP_ID,
            self::HIDE_FLAG,
            date('Y-m-d', strtotime('+' . self::HIDE_FOR))
        );
    }

    private function canShow(waContact $user): bool
    {
        $now = new DateTimeImmutable();
        if ($now->format('Y-m-d') < $user->getSettings(tasksConfig::APP_ID, self::HIDE_FLAG, $now->format('Y-m-d'))) {
            return false;
        }

        $apiTokensModel = new waApiTokensModel();
        if ($now->format('Y-m-d') < self::START_DATE
            || $apiTokensModel->getByField('client_id', 'com.webasyst.teamwork')
            || $apiTokensModel->getByField('client_id', 'com.webasyst.teamwork.ios')
            || $apiTokensModel->getByField('client_id', 'com.webasyst.teamwork.android')
        ) {
            return false;
        }

        $tasksLogModel = new tasksTaskLogModel();
        $taskLog = $tasksLogModel->findFirstLogForContactId($user->getId());
        if (!$taskLog) {
            return false;
        }

        $firstLogDate = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $taskLog['create_datetime']);
        if ($firstLogDate->diff($now)->days <= 3) {
            return false;
        }

        return true;
    }
}
