<?php

class tasksReleasesPluginKanbanHideNewAndCompletedSaveController extends waJsonController
{
    public function execute()
    {
        $is_checked = (bool)waRequest::post('hide_new_and_completed_tasks', 0, waRequest::TYPE_INT);
        wa()->getUser()->set('tasks', 'hide_new_and_completed_tasks', $is_checked);
    }
}