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
            $pricing = array(
              'compare_price' => '27 999',
              'price' => '7 999 <span class="ruble">₽</span>/год'
            );
        }
        else
        {
            $pricing = array(
              'compare_price' => '$449',
              'price' => '$129/yr'
            );
        }

        return $pricing;
    }
}
