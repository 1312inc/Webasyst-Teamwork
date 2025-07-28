<?php

class tasksKanbanHideNewAndCompletedSaveController extends waJsonController
{
    public function execute()
    {
        $is_checked = waRequest::post('hide_new_and_completed_tasks', 0, waRequest::TYPE_INT);
        wa()->getUser()->setSettings('tasks', 'hide_new_and_completed_tasks', $is_checked);
    }
}
