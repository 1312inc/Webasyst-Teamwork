<?php

/**
 * Accepts submit from task editor form to create new or modify existing tasks.
 */
class tasksTasksSaveController extends waJsonController
{
    public function execute()
    {
        $task_id = $this->getId();
        $data = $this->getData();

        if (isset($data['roles_user']['add'])) {
            $role_users = (new tasksRights())->getUsersAccessProject($data['project_id']);
            foreach ($data['roles_user']['add'] as $user_ids) {
                foreach ($user_ids as $user_id) {
                    if (!key_exists($user_id, $role_users)) {
                        $contact = new waContact($user_id);
                        $this->setError(sprintf(_w('No access: user %s is not eligible for the specified role in this task').' ', $contact->getName()));
                    }
                }
            }
            if ($this->errors) {
                return;
            }
        }

        $is_new = false;
        if ($task_id > 0) {
            $task = $this->update($task_id, $data);
        } else {
            $is_new = true;
            $task = $this->add($data);
        }

        $task_id = ifset($task, 'id', null);

        if ($task_type = $this->getRequest()->post('task_type', '', waRequest::TYPE_STRING_TRIM)) {
            (new tasksTaskExtModel())->save([
                'type'    => $task_type,
                'task_id' => $task_id
            ]);

            $fields_data = $this->getRequest()->post('fields', [], waRequest::TYPE_ARRAY);
            if ($fields_data = ifempty($fields_data, $task_type, [])) {
                (new tasksFieldDataModel())->save($task_id, $fields_data);
            }
        }

        if (!empty($data['roles_user'])) {
            $_POST['task_id'] = $task_id;
            $controller = new tasksTasksUsersRoleController();

            foreach ($data['roles_user'] as $act => $roles) {
                $_GET['act'] = $act;
                foreach ($roles as $role_id => $user_ids) {
                    foreach ($user_ids as $user_id) {
                        $_POST['user_id'] = $user_id;
                        $_POST['role_id'] = $role_id;

                        $controller->execute();
                    }
                }
            }
        }

        if ($is_new) {
            $sender = new tasksNotificationsSender($task, ['new', 'mention']);
        } else {
            $sender = new tasksNotificationsSender($task, ['edit', 'mention']);
        }
        $sender->send();

        $this->response = array(
            'url' => $task['project_id'].'.'.$task['number'],
            'id'  => $task['id'],
        );
    }

    protected function getId()
    {
        return (int)wa()->getRequest()->get('id');
    }

    protected function getData()
    {
        $hash = (string)wa()->getRequest()->post('files_hash');
        $data = (array)wa()->getRequest()->post('data');
        if (!$data && !$hash) {
            throw new waException('', 400);
        }

        if (isset($data['due_date'])) {
            $ts = @strtotime($data['due_date']);
            if ($ts) {
                $data['due_date'] = date('Y-m-d', $ts);
            } else {
                $data['due_date'] = null;
            }
        }

        $data['files_hash'] = $hash;

        return $data;
    }

    protected function saveAttachments($id, $data)
    {
        $am = new tasksAttachmentModel();
        $am->addAttachmentsByHash($id, null, $data['files_hash']);
    }

    protected function saveTags($task, $prev_task = null)
    {
        $tasks_task_tags_model = new tasksTaskTagsModel();
        $collect_header_tags = array();

        //If have prev version, need search tags which set in autocomplete and resave them
        if (!empty($prev_task['id'])) {
            $parse_old_tags = tasksTask::extractTags($prev_task['text']);
            $old_tags = $tasks_task_tags_model->getByTasks(array($prev_task));

            if (!empty($old_tags[$prev_task['id']])) {
                $old_tags = $old_tags[$prev_task['id']];
                foreach ($old_tags as $key => $tag) {
                    $id = array_search($tag['name'], $parse_old_tags);
                    if ($id === false) {
                        //Remove if tags set in task body
                        $collect_header_tags[] = $tag['name'];
                    } else {
                        //Search tags which set in autocomplete field
                        unset($old_tags[$key]);
                    }
                }
            }
        }

        $parse_new_tags = tasksTask::extractTags($task['text']);
        $new_tags = array_merge($parse_new_tags, $collect_header_tags);

        $tasks_task_tags_model->save($task['id'], $new_tags);

        // Parse @mentions
        tasksHelper::updateUnreadForMentions($task['text'], $task);
    }

    /**
     * Create relations between tasks
     * See tasksTaskRelationsModel
     * @param $task
     * @param array $prev_task
     * @return bool
     */
    protected function saveTaskRelations($task, $prev_task = array())
    {
        $task_relation_model = new tasksTaskRelationsModel();
        $tasks_number = tasksTask::extractTaskNumbers(ifset($task, 'text', null));
        $new_ids = $this->parseTaskNumberAndGetTaskId($tasks_number);

        if (!empty($prev_task)) {
            $prev_task_number = tasksTask::extractTaskNumbers($prev_task['text']);
            $old_ids = $this->parseTaskNumberAndGetTaskId($prev_task_number);
        }

        //You can not save a link to yourself
        $old_ids[$task['id']] = array();

        $result = $task_relation_model->save($task['id'], $new_ids, $old_ids);

        return $result;
    }


    protected function parseTaskNumberAndGetTaskId($tasks_number = array(), $fetch = 'id')
    {
        if (!$tasks_number) {
            return array();
        }

        $task_model = new tasksTaskModel();

        $where = array();
        $params_where = array();

        foreach ($tasks_number as $number) {
            $number_parse = explode('.', $number);
            $where[] = '(project_id = ? AND number = ?)';
            $params_where = array_merge($params_where, $number_parse);
        }

        $task_ids = $task_model
            ->select(' id, concat(project_id, \'.\', number) as full_number ')
            ->where(implode(' OR ', $where), $params_where)
            ->fetchAll($fetch);

        return $task_ids;
    }

    protected function update($id, $data)
    {
        $task_model = new tasksTaskModel();
        $prev_task = $task_model->getById($id);
        if (!$prev_task) {
            return null;
        }

        $rights = new tasksRights();
        if (!$rights->canEditTask($prev_task)) {
            throw new waRightsException(_w('Access denied'));
        }

        $task_model->update($id, $data);
        $task = $task_model->getById($id);

        $this->saveAttachments($task['id'], $data);
        $this->saveTags($task, $prev_task);
        $this->saveTaskRelations($task, $prev_task);

        $log_item = $this->addLogItem($task, $prev_task['status_id'], 'edit');

        if (ifset($prev_task, 'project_id', null) != ifset($data, 'project_id', null)) {
            $task_log_params_model = new tasksTaskLogParamsModel();
            $task_log_params_model->insert(
                array(
                    'task_id' => $id,
                    'log_id'  => $log_item['id'],
                    'name'    => 'prev.project.number',
                    'value'   => $prev_task['project_id'].'.'.$prev_task['number']
                )
            );
        }

        $this->logAction('task_edit', $task['id'].':'.$log_item['id']);

        $this->triggerEvent($task, array(
            'type'      => 'edit',
            'prev_task' => $prev_task
        ));

        return $task;
    }

    protected function add($data)
    {
        if (empty($data['uuid'])) {
            $data['uuid'] = tasksUuid4::generate();
        }

        $task_model = new tasksTaskModel();
        $task = $task_model->add($data);
        if (!$task) {
            return null;
        }

        $this->saveAttachments($task['id'], $data);
        $this->saveTags($task);

        $this->saveTaskRelations($task);

        $this->addLogItem($task, null, tasksTaskLogModel::ACTION_TYPE_ADD);

        $this->logAction('task_add', $task['id']);

        $this->triggerEvent($task, array(
            'type' => 'add'
        ));

        return $task;
    }

    protected function addLogItem($task, $before_status_id, $action)
    {
        $log_model = new tasksTaskLogModel();
        $log_item = array(
            'project_id'          => $task['project_id'],
            'task_id'             => $task['id'],
            'action'              => $action,
            'before_status_id'    => $before_status_id,
            'after_status_id'     => $task['status_id'],
            'assigned_contact_id' => ifempty($task['assigned_contact_id'])
        );
        $log_id = $log_model->add($log_item);
        return $log_model->getById($log_id);
    }

    protected function triggerEvent($task, $params)
    {
        /**
         * @param array $task
         * @param string type 'add' | 'edit'
         * @param null|array $prev_task
         * @event task_save
         */
        $params['task'] = $task;
        wa()->event('task_save', $params);
    }
}
