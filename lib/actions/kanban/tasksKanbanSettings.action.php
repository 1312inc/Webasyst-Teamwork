<?php

class tasksKanbanSettingsAction extends waViewAction
{
    public function execute()
    {
        $id = waRequest::post('id', null, waRequest::TYPE_INT);

        $tasks_ext_model = new tasksTaskExtModel();
        $kanban_color = $tasks_ext_model->select('kanban_color')
            ->where('task_id = ?', $id)
            ->fetchField('kanban_color');

        $this->view->assign([
            'task_id'      => $id,
            'colors'       => wa()->getConfig()->getProjectColors(),
            'kanban_color' => $kanban_color
        ]);
    }
}
