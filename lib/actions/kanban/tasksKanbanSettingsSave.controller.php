<?php

class tasksKanbanSettingsSaveController extends waJsonController
{
    public function execute()
    {
        $task_id = waRequest::post('task_id', null, waRequest::TYPE_INT);
        if ($task_id < 1) {
            throw new waException(_w('Not found'), 404);
        }
        $kanban_task_settings = waRequest::post('kanban_task_settings', [], waRequest::TYPE_ARRAY);
        $tasks_ext_model = new tasksTaskExtModel();

        if (!$tasks_ext_model->countByField('task_id', $task_id)) {
            $tasks_ext_model->insert(['task_id' => $task_id]);
        }
        if (!empty($kanban_task_settings['custom_color'])) {
            $this->response['status'] = $tasks_ext_model->updateById($task_id, ['kanban_color' => $kanban_task_settings['custom_color']]);
            $this->response['new_color'] = $kanban_task_settings['custom_color'];
        } elseif (!empty($kanban_task_settings['color'])) {
            $this->response['status'] = $tasks_ext_model->updateById($task_id, ['kanban_color' => $kanban_task_settings['color']]);
            $this->response['new_color'] = $kanban_task_settings['color'];
        }
    }
}