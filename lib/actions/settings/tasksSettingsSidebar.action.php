<?php

class tasksSettingsSidebarAction extends waViewAction
{
    protected $milestones;

    public function execute()
    {
        $this->accessDeniedForNotAdmin();
        $this->view->assign(array(
            'scopes' => $this->getScopes(),
            'archive_scopes' => $this->getScopes(true),
            'projects' => tsks()->getEntityRepository(tasksProject::class)
                ->getProjectsAsArray(tasksProjectRepository::GET_PROJECT_ACTIVE),
            'archive_projects' => tsks()->getEntityRepository(tasksProject::class)
                ->getProjectsAsArray(tasksProjectRepository::GET_PROJECT_ARCHIVE),
            'backend_settings_sidebar' => $this->triggerEvent()
        ));
    }

    protected function triggerEvent()
    {
        /**
          * @event backend_settings_sidebar
          * @return array[string]array $return[%plugin_id%] array of html output
          * @return array[string][string]string $return[%plugin_id%]['top_li'] html output
          * @return array[string][string]string $return[%plugin_id%]['section'] html output
        */
        return wa()->event('backend_settings_sidebar');
    }

    protected function getScopes($is_closed = false)
    {
        if ($this->milestones === null) {
            $this->milestones = $this->fetchMilestones();
        }

        $scopes = array();
        foreach ($this->milestones as $milestone) {
            if ((bool)$milestone['closed'] === $is_closed) {
                $scopes[$milestone['id']] = $milestone;
            }
        }

        return $scopes;
    }

    protected function fetchMilestones()
    {
        $model = new tasksMilestoneModel();
        $milestones = $model->getMilestonesWithOrder();
        tasksMilestoneModel::workup($milestones, array(
            'extra' => 'project'
        ));
        return $milestones;
    }

    protected function accessDeniedForNotAdmin()
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }
    }
}
