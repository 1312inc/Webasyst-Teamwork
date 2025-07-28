<?php
/**
 * Helper $wa->tasks in smarty templates
 */
class tasksViewHelper extends waAppViewHelper
{
    public function statusButton($status)
    {
        return '<a href="javascript:void(0);" class="t-control-link" data-status-id="'.htmlspecialchars($status['id']).'">'.htmlspecialchars($status['button']).'</a>';
    }

    public static function isPremium()
    {
        return tasksLicensing::isPremium();
    }

    /**
     * @return array
     */
    public static function getPremiumPricing()
    {
        // vofka says sorry for such a hard code
        // we were young and needed the money

        if (wa()->getLocale() == 'ru_RU')
        {
            $pricing = array( 'compare_price' => '', 'price' => '11 999 <span class="ruble">₽</span>', 'special' => '' );
            if (date('Ymd')<='20250630') $pricing = array( 'compare_price' => '11 999', 'price' => '5 999 <span class="ruble">₽</span>', 'special' => '&minus;50% до 30.06', 'special_short' => '&minus;50% до 30.06', 'special_color' => 'orange' );
            elseif (date('Ymd')<='20250731') $pricing = array( 'compare_price' => '11 999', 'price' => '7 999 <span class="ruble">₽</span>', 'special' => '&minus;33% до 31.07', 'special_short' => '', 'special_color' => 'green' );
        }
        else
        {
            $pricing = array( 'compare_price' => '', 'price' => '$199', 'special' => '' );
            if (date('Ymd')<='20250630') $pricing = array( 'compare_price' => '$199', 'price' => '$99', 'special' => '&minus;50% / 06.30', 'special_short' => '&minus;50% / 06.30', 'special_color' => 'orange' );
            elseif (date('Ymd')<='20250731') $pricing = array( 'compare_price' => '$199', 'price' => '$129', 'special' => '&minus;35%', 'special_short' => '', 'special_color' => 'green' );
        }

        return $pricing;
    }
}
