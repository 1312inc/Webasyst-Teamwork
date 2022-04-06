<?php

class tasksReleasesPluginKanbanSettingsAction extends waViewAction
{
    public function execute()
    {
        $id = waRequest::post('id', null, waRequest::TYPE_INT);

        $tasks_releases_task_ext_model = new tasksReleasesPluginTaskExtModel();
        $kanban_color = $tasks_releases_task_ext_model->select('kanban_color')->where('task_id = ?', $id)->fetchField('kanban_color');

        $this->view->assign('colors', wa()->getConfig()->getProjectColors());
        $this->view->assign('kanban_color', $kanban_color);
        $this->view->assign('task_id', $id);
    }
}