<?php

class tasksTasksCommentsActions extends waJsonActions
{
    public function addActionOld()
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
                'action'           => tasksTaskLogModel::ACTION_TYPE_COMMENT,
                'attachments_hash' => $hash
            ) + $data);

        $this->logAction('task_comment', $task_id.':'.$log['id']);

        $task_model->update($task_id, array(
            'comment_log_id' => $log['id']
        ));

        $this->response = $log;
    }

    public function addAction()
    {
        $data = waRequest::post('data', [], 'array');

        try {
            $this->response = (new tasksApiCommentAddHandler())->add(
                new tasksApiCommentAddRequest(
                    (int) waRequest::get('task_id'),
                    (string) isset($data['text']) ? $data['text'] : '',
                    (string) waRequest::post('files_hash')
                )
            );
        } catch (Exception $exception) {
            $this->errors = $exception->getMessage();
        }
    }

    public function deleteActionOld()
    {
        $comment = $this->getComment();
        $this->checkCanDelete($comment);
        $task_log_model = new tasksTaskLogModel();
        $task_log_model->delete($comment['id']);
    }

    public function deleteAction()
    {
        (new tasksApiCommentDeleteHandler())->delete(new tasksApiCommentDeleteRequest((int) waRequest::post('id', 0)));
    }

    public function saveActionOld()
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

    public function saveAction()
    {
        $data = (array) $this->getRequest()->post('data');

        $this->response = (new tasksApiCommentUpdateHandler())->update(
            new tasksApiCommentUpdateRequest(
                (int) waRequest::get('id'),
                (string) isset($data['text']) ? $data['text'] : '',
                (string) waRequest::post('files_hash')
            )
        );
    }

    /**
     * @param string|string[] $type - default is ACTION_TYPE_COMMENT
     *
     * @return null
     * @throws waException
     */
    public function getComment($type = tasksTaskLogModel::ACTION_TYPE_COMMENT)
    {
        $id = (int) $this->getRequest()->request('id');
        $lm = new tasksTaskLogModel();
        $log = $lm->getComment($id, $type);
        if (!$log) {
            $this->notFound();
        }

        return $log;
    }

    public function assignActionOld()
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

    public function assignAction()
    {
        try {
            $this->response = (new tasksApiCommentPinHandler())->pin(
                new tasksApiCommentPinRequest((int) waRequest::post('task_id'), (int) waRequest::post('log_id'))
            );
        } catch (Exception $exception) {
            $this->errors = $exception->getMessage();

            return;
        }
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
            ->where("task_id=i:task_id AND action='comment'", ['task_id' => $task_id])
            ->order('id DESC')
            ->fetchAssoc();

        $new_log_id = ifset($log, 'id', null);

        if ($new_log_id == $log_id) {
            $new_log_id = null;
        }

        $result = $task_model->update($task_id,
            ['comment_log_id' => $new_log_id]
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
