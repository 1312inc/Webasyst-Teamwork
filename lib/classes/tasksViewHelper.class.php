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
            if (date('Ymd')<='20251031') $pricing = array( 'compare_price' => '11 999', 'price' => '8 999 <span class="ruble">₽</span>', 'special' => '&minus;25% до 31.10', 'special_short' => '&minus;25% / 31.10', 'special_color' => 'orange' );
        }
        else
        {
            $pricing = array( 'compare_price' => '$449', 'price' => '$199', 'special' => '' );
            if (date('Ymd')<='20251031') $pricing = array( 'compare_price' => '$199', 'price' => '$149', 'special' => '&minus;25%', 'special_short' => '&minus;25% / 10.31', 'special_color' => 'orange' );
        }

        return $pricing;
    }
}
