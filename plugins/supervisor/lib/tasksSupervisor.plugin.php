<?php

class tasksSupervisorPlugin extends waPlugin
{
    public function backendSidebar()
    {
        $supervisor_model = new tasksSupervisorModel();
        $count = $supervisor_model->countByContact(wa()->getUser()->getId());
        return wa()->whichUI() == '1.3' ? array(
            'top_li' => '<li>
                    <span class="count">'.$count.'</span>
                    <a href="#/tasks/supervisor/"><i class="icon16 exclamation"></i>'._wp('Watching').'</a>
            </li>'
        )
        :
        array(
            'top_li' => '<li>
                    <a href="#/tasks/supervisor/">
                        <span class="count">'.$count.'</span>
                        <i class="fas fa-user-secret"></i><span>'._wp('Watching').'</span>
                    </a>
            </li>'
        );
    }

    public function tasksCollection($params)
    {
        /**
         * @var tasksCollection $collection
         */
        $collection = $params['collection'];
        if ($collection->getType() == 'supervisor') {
            $collection->addJoin('tasks_supervisor', null, ':table.contact_id = '.(int)wa()->getUser()->getId());
            $collection->addWhere('t.status_id >= 0');
            return true;
        }
        return null;
    }

    public function backendTaskEdit($params)
    {
        $task = $params['task'];
        $view = wa()->getView();

        $supervisor_ids = array();
        if ($task['id']) {
            $supervisor_model = new tasksSupervisorModel();
            $supervisor_ids = array_keys($supervisor_model->getByField('task_id', $task['id'], 'contact_id'));
        }

        $view->assign(array(
            'users' => $params['action']->users,
            'uniqid' => str_replace('.', '-', uniqid('t-supervisor-', true)),
            'supervisor_ids' => $supervisor_ids,
        ));
        return array(
            'more' => $view->fetch($this->path.'/templates/BackendTaskFields.html'),
        );
    }

    public function taskSave($params)
    {
        $task = $params['task'];
        $contact_ids = waRequest::post('supervisor_id', array(), waRequest::TYPE_ARRAY_INT);
        $contact_ids = array_filter($contact_ids);

        if ($contact_ids && !empty($task['id'])) {
            $supervisor_model = new tasksSupervisorModel();
            $supervisor_model->save($task['id'], $contact_ids);
        }
    }

    public function taskDelete($params)
    {
        $supervisor_model = new tasksSupervisorModel();
        $supervisor_model->deleteByField('task_id', $params['ids']);
    }

    // send notification to supervisors when task is modified
    public function taskLogAdd($params)
    {
        $log = $params['log'];
        $task = $params['task'];

        try {
            $from_contact = new waContact($log['contact_id']);
            $from_contact->getName();
        } catch (Exception $e) {
            $from_contact = wa()->getUser();
        }

        $supervisor_model = new tasksSupervisorModel();
        $contact_ids = $supervisor_model->getByField('task_id', $task['id'], 'contact_id');
        unset($contact_ids[$log['contact_id']]);
        $contact_ids = array_keys($contact_ids);
        if (!$contact_ids) {
            return;
        }

        $contacts_collection = new waContactsCollection('id/'.join(',', $contact_ids));
        $contacts = $contacts_collection->getContacts('name,email,firstname,middlename,lastname');
        $contacts = array_filter($contacts, wa_lambda('$c', 'return !empty($c["email"]);'));
        if (!$contacts) {
            return;
        }

        $view = wa()->getView();
        $template_path = $this->path.'/templates/Mail.html';
        if (!file_exists($template_path)) {
            waLog::log('Unable to send Tasks supervisor notification. Template not found: '.$template_path);
            return;
        }

        //$task['text_html'] = tasksTask::formatText($task['text']);
        $task['url'] = wa()->getRootUrl(true).wa()->getConfig()->getBackendUrl(false).'/tasks/#/task/'.$task['project_id'].'.'.$task['number'].'/';
        if (!empty($log['text'])) {
            $log['text_html'] = tasksTask::formatText($log['text']);
        }

        $statuses = tasksHelper::getStatuses(null, false);
        $status = ifset($statuses[$log['after_status_id']], array(
            'id' => $log['after_status_id'],
            'name' => 'Unknown status '.$log['after_status_id'],
        ));

        $view->assign(array(
            'log' => $log,
            'task' => $task,
            'from' => $from_contact,
            'status' => $status,
        ));

        $subject = _w("Task you're watching has been updated");

        foreach($contacts as $c) {
            $view->assign(array(
                'to' => new waContact($c),
            ));
            try {
                $m = new waMailMessage($subject, $view->fetch($template_path));
                $m->setTo($c['email'][0]);
                $m->send();
            } catch (Exception $e) {
                waLog::log('Unable to send Tasks supervisor notification: '.$e->getMessage());
            }
        }
    }
}
