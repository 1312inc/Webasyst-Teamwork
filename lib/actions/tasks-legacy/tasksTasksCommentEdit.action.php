<?php

class tasksTasksCommentEditAction extends waViewAction
{
    public function execute()
    {
        $comment = $this->getComment();
        $this->view->assign(array(
            'comment' => $comment
        ));
    }

    public function getComment()
    {
        $id = (int)$this->getRequest()->get('id');
        $lm = new tasksTaskLogModel();
        $log = $lm->getById($id);
        if (!$log) {
            $this->notFound();
        }

        $rights = new tasksRights();
        if (!$rights->canEditLogItem($log)) {
            $this->accessDenied();
        }

        $task = new tasksTask($log['task_id']);
        $attachments = $task->getLogAttachments($log['id']);
        $log['images'] = $attachments['images'];
        $log['files'] = $attachments['files'];

        return $log;

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
