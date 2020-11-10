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
}
