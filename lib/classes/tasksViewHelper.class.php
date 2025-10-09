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
        return tasksLicensing::check('tasks')->isPremium();
    }

    /**
     * @return bool
     */
    public static function isCloud()
    {
        return wa()->appExists('hosting');
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
            $pricing = array( 'compare_price' => '27 999', 'price' => '11 999 <span class="ruble">₽</span>', 'special' => '' );
            // if (date('Ymd')<='20250731') $pricing = array( 'compare_price' => '11 999', 'price' => '8 399 <span class="ruble">₽</span>', 'special' => '&minus;30% до 31.07', 'special_short' => '&minus;30% / 31.07', 'special_color' => 'orange' );
        }
        else
        {
            $pricing = array( 'compare_price' => '$449', 'price' => '$199', 'special' => '' );
            // if (date('Ymd')<='20250731') $pricing = array( 'compare_price' => '$199', 'price' => '$139', 'special' => '&minus;30%', 'special_short' => '&minus;30% / 07.31', 'special_color' => 'orange' );
        }

        return $pricing;
    }
}
