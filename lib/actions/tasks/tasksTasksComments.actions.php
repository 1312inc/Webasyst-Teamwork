<?php

class tasksTasksCommentsActions extends waJsonActions
{
    public function addAction()
    {
        $task_id = waRequest::get('task_id');

        $task_model = new tasksTaskModel();
        $task = $task_model->getById($task_id);
        if (!$task) {
            $this->errors = 'Task not found';
            return;
        }

        $data = waRequest::post('data', array(), 'array');
        $hash = (string)wa()->getRequest()->post('files_hash');

        $log = tasksHelper::addLog($task, array(
                'action'           => 'comment',
                'attachments_hash' => $hash
            ) + $data);

        $this->logAction('task_comment', $task_id.':'.$log['id']);

        $task_model->update($task_id, array(
            'comment_log_id' => $log['id']
        ));

        $this->response = $log;
    }

    public function deleteAction()
    {
        $comment = $this->getComment();
        $this->checkCanDelete($comment);
        $task_log_model = new tasksTaskLogModel();
        $task_log_model->delete($comment['id']);
    }

    public function saveAction()
    {
        // possible actions with that comment can be added
        $possible_action_types = [
            tasksTaskLogModel::ACTION_TYPE_COMMENT,
            tasksTaskLogModel::ACTION_TYPE_FORWARD,
            tasksTaskLogModel::ACTION_TYPE_RETURN,
            tasksTaskLogModel::ACTION_TYPE_EMPTY,
        ];

        $comment = $this->getComment($possible_action_types);

        // No need empty comment
        if ($comment['is_empty']) {
            $this->deleteAction();
            return;
        }

        $this->checkCanEdit($comment);

        $data = (array)$this->getRequest()->post('data');
        $hash = (string)wa()->getRequest()->post('files_hash');

        $lm = new tasksTaskLogModel();
        $lm->updateById($comment['id'], array(
            'text' => $data['text']
        ));

        $am = new tasksAttachmentModel();
        $am->addAttachmentsByHash($comment['task_id'], $comment['id'], $hash);

        $comment = $this->getComment($possible_action_types);

        if ($comment['is_empty']) {
            // No need empty comment
            $this->deleteAction();
        } else {
            $this->logAction('task_comment_edit', $comment['task_id'].':'.$comment['id']);
            $this->response = $comment;
        }
    }

    /**
     * @param string|string[] $type - default is ACTION_TYPE_COMMENT
     * @return null
     * @throws waException
     */
    public function getComment($type = tasksTaskLogModel::ACTION_TYPE_COMMENT)
    {
        $id = (int)$this->getRequest()->request('id');
        $lm = new tasksTaskLogModel();
        $log = $lm->getComment($id, $type);
        if (!$log) {
            $this->notFound();
        }
        return $log;
    }

    public function checkCanDelete($log_item)
    {
        $rights = new tasksRights();
        if (!$rights->canDeleteLogItem($log_item)) {
            $this->accessDenied();
        }
    }

    public function checkCanEdit($log_item)
    {
        $rights = new tasksRights();
        if (!$rights->canEditLogItem($log_item)) {
            $this->accessDenied();
        }
    }

    public function assignAction()
    {
        $task_id = waRequest::post('task_id');
        $log_id = waRequest::post('log_id');

        $task_model = new tasksTaskModel();
        $task = $task_model->getById($task_id);
        if (!$task) {
            $this->errors = 'Task not found';
            return;
        }
        $result = $task_model->update($task_id,
            array('comment_log_id' => $log_id)
        );

        $this->response = $result;
    }

    public function undoAction()
    {
        $task_id = waRequest::post('task_id');
        $log_id = waRequest::post('log_id');

        $task_model = new tasksTaskModel();
        $task_log_model = new tasksTaskLogModel();

        $task = $task_model->getById($task_id);
        if (!$task) {
            $this->errors = 'Task not found';
            return;
        }

        $log = $task_log_model->select('id')
                       ->where("task_id=i:task_id AND action='comment'", array('task_id' => $task_id))
                       ->order('id DESC')
                       ->fetchAssoc();

        $new_log_id = ifset($log,'id', null);

        if ($new_log_id == $log_id) {
            $new_log_id = null;
        }

        $result = $task_model->update($task_id,
            array('comment_log_id' => $new_log_id)
        );

        $this->response = $result;
    }

    protected function notFound()
    {
        throw new waException(_w('Not found'), 404);
    }

    protected function accessDenied()
    {
        throw new waException(_w('Access denied'), 403);
    }
}
