<?php
class tasksTasksBulkActions extends waJsonActions
{
    protected function doneAction()
    {
        $task_ids = $this->getIds();
        $task_ids = $this->filterByRight($task_ids, 'can_edit');
        if (!$task_ids) {
            return;
        }

        $task_model = new tasksTaskModel();
        $tasks = $task_model->getById($task_ids);
        if (!$tasks) {
            return;
        }

        $email_one_by_one = (count($tasks) <= tasksOptions::getBulkNotificationLimit());
        $email_one_by_one = true; // !!! TODO bulk email sending is not implemented for Done action

        // Send tasks to Done state
        foreach($tasks as $task_data) {
            $log = tasksHelper::addLog($task_data, array(
                'action' => '',
                'status_id' => -1,
                'text' => '',
            ), $email_one_by_one);
        }

        // Unless we sent notifications per-task earlier,
        // send a single notification about this bulk operation
        if (!$email_one_by_one) {
            // !!! TODO
        }

        if (count($tasks) > 1) {
            $this->logAction('task_bulk_done', join(',', array_keys($tasks)));
        } else if (!empty($log)) {
            $this->logAction('task_action', $log['task_id'].':'.$log['id']);
        }
    }

    protected function forwardAction()
    {
        $task_ids = $this->getIds();
        $task_ids = $this->filterByRight($task_ids, 'can_edit');
        if (!$task_ids) {
            return;
        }

        $task_model = new tasksTaskModel();
        $tasks = $task_model->getById($task_ids);
        if (!$tasks) {
            return;
        }

        $text = waRequest::post('text', null, 'string');
        $status_id = waRequest::post('status_id', null, 'int');
        $assigned_contact_id = waRequest::post('assigned_contact_id', null, 'int');
        $email_one_by_one = (count($tasks) <= tasksOptions::getBulkNotificationLimit());

        $project_id = waRequest::post('project_id', null, 'int');
        if ($project_id) {
            $project_model = new tasksProjectModel();
            $project = $project_model->getById($project_id);
            if (!$project) {
                $project_id = null;
            }
        }

        // Forward tasks one by one
        foreach ($tasks as $task_data) {
            if ($project_id && $task_data['project_id'] != $project_id) {
                $update = array(
                    'project_id' => $project_id,
                    'number' => ++$project['tasks_number'],
                    'update_datetime' => false, // sneaky update
                );
                $task_data = $update + $task_data;
                $task_model->updateById($task_data['id'], $update);
            }
            if ($assigned_contact_id || isset($status_id) || !empty($text)) {
                $log = tasksHelper::addLog($task_data, array(
                    'action' => 'forward',
                    'status_id' => $status_id ?: $task_data['status_id'],
                    'assigned_contact_id' => $assigned_contact_id,
                    'do_not_update_datetime' => empty($text),
                    'text' => $text,
                ), $email_one_by_one);
            }
        }

        if ($project_id) {
            $log_model = new tasksTaskLogModel();
            $log_model->updateByField('task_id', $task_ids, array('project_id' => $project_id));
            $project_model->updateById($project_id, array(
                'tasks_number' => new waModelExpr('(SELECT IFNULL(MAX(number), 0) FROM tasks_task WHERE project_id = '.$project['id'].')'),
            ));
        }

        // Unless we sent notifications per-task earlier,
        // send a single notification about this bulk operation
        if (!$email_one_by_one && $assigned_contact_id) {
            tasksNotifications::sendBulk('assign', count($tasks), new waContact($assigned_contact_id), $text);
        }

        if (count($tasks) > 1) {
            $this->logAction('task_bulk_forward', join(',', array_keys($tasks)));
        } else if (!empty($log)) {
            $this->logAction('task_forward', $log['task_id'].':'.$log['id']);
        }
    }

    protected function priorityAction()
    {
        $task_ids = $this->getIds();
        $task_ids = $this->filterByRight($task_ids, 'can_edit');
        $priority = waRequest::post('priority', null, 'int');
        if (!$task_ids || $priority === null) {
            return;
        }
        $task_model = new tasksTaskModel();
        $task_model->updateById($task_ids, array(
            'update_datetime' => false, // sneaky update
            'priority' => $priority,
        ));
    }

    protected function deadlineAction()
    {
        $ids = $this->getIds();
        if (!$ids) {
            return;
        }

        $due_date = $this->getDueDate();
        if (!$due_date) {
            return;
        }

        $tm = new tasksTaskModel();
        $tm->updateById($ids, array(
            'update_datetime' => false, // sneaky update
            'due_date' => $due_date
        ));
    }

    protected function getDueDate()
    {
        $due_date = $this->getRequest()->post('due_date');
        if ($due_date !== null) {
            $time = strtotime($due_date);
            if ($time !== null && $time > 0) {
                return $due_date;
            }
        }
        return null;
    }

    protected function getIds()
    {
        $ids = wa()->getRequest()->post('ids');
        $ids = tasksHelper::toIntArray($ids);
        $ids = tasksHelper::dropNotPositive($ids);
        return $ids;
    }

    protected function filterByRight($ids, $right)
    {
        $tm = new tasksTaskModel();
        $tasks = $tm->getById($ids);
        $rights = new tasksRights();
        $rights->extendTasksByRightsInfo($tasks);
        $result_ids = array();
        foreach ($tasks as $task) {
            if ($task['rights_info'][$right]) {
                $result_ids[] = $task['id'];
            }
        }
        return $result_ids;
    }
}

