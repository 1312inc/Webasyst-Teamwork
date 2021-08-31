<?php

class tasksReleasesPluginKanbanSettingsSaveController extends waJsonController
{
    public function execute()
    {
        $task_id = waRequest::post('task_id', null, waRequest::TYPE_INT);
        if ($task_id < 1) {
            throw new waException(_w('Not found'), 404);
        }
        $kanban_task_settings = waRequest::post('kanban_task_settings', [], waRequest::TYPE_ARRAY);
        $tasks_releases_task_ext_model = new tasksReleasesPluginTaskExtModel();

        if (!empty($kanban_task_settings['custom_color'])) {
            $this->response['status'] = $tasks_releases_task_ext_model->updateById($task_id, ['kanban_color' => $kanban_task_settings['custom_color']]);
            $this->response['new_color'] = $kanban_task_settings['custom_color'];
        } elseif (!empty($kanban_task_settings['color'])) {
            $this->response['status'] = $tasks_releases_task_ext_model->updateById($task_id, ['kanban_color' => $kanban_task_settings['color']]);
            $this->response['new_color'] = $kanban_task_settings['color'];
        }
    }
}