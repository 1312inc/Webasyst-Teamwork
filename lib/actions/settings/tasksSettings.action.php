<?php
/**
 * HTML for general settings form (i.e. list of project statuses).
 */
class tasksSettingsAction extends waViewAction
{
    protected $milestones;

    public function execute()
    {
        $this->accessDeniedForNotAdmin();

        $statuses = tasksHelper::getStatuses(null, false);
        $status_model = new tasksStatusModel();
        $empty_status = tasksHelper::extendIcon(array(
                'id' => '%ID%',
                'params' => array(),
                'special' => 0,
            ) + $status_model->getEmptyRow());

        $this->view->assign(array(
            'statuses' => $statuses,
            'empty_status' => $empty_status,
            'sidebar_html' => $this->getSidebarHtml(),
            'icons' => wa()->getConfig()->getStatusIcons()
        ));

    }

    protected function getSidebarHtml()
    {
        $sidebar = new tasksSettingsSidebarAction();
        return $sidebar->display();
    }

    protected function accessDeniedForNotAdmin()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }
    }
}

