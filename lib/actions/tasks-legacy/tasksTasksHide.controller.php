<?php

class tasksTasksHideController extends waJsonController
{
    public function execute()
    {
        $task_id = waRequest::post('id');
        $task_model = new tasksTaskModel();
        $task = $task_model->getById($task_id);
        if ($task['assigned_contact_id'] != $this->getUserId()) {
            throw new waRightsException(_w('You can only hide tasks assigned to you.'));
        }
        if ($task['priority'] > 0) {
            throw new waRightsException(_w("You can't hide high priority task"));
        }
        $time = 0;
        $interval = waRequest::post('interval', '', 'string_trim');
        if ($interval) {
            if (!preg_match('~^\d[wd]$~', $interval)) {
                throw new waException('Unknown interval');
            }
            $time = strtotime('+'.str_replace(array('d', 'w'), array(' DAY', ' WEEK'), $interval));
        }

        $task_model->updateById($task_id, array(
            'update_datetime' => false, // sneaky update
            'hidden_timestamp' => $time,
        ));

        $c = new tasksCollection('hidden');
        $this->response['count'] = $c->count();
    }
}