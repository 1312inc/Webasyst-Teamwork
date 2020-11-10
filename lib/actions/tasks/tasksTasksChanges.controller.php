<?php

class tasksTasksChangesController extends waJsonController
{
    public function execute()
    {
        $task = $this->getTask();
        if (!$task) {
            return;
        }

        $this->response = array(
            'task' => $task,
            'url' => '#/task/'.$task['project_id'].'.'.$task['number'].'/'
        );
    }

    protected function getTask()
    {
        $id = (int)$this->getRequest()->get('id');
        if ($id <= 0) {
            return null;
        }

        $tm = new tasksTaskModel();
        $task = $tm->getById($id);
        if (!$task) {
            return null;
        }
        $rights = new tasksRights();
        if (!$rights->canViewTask($task)) {
            return null;
        }

        $am = new tasksAttachmentModel();
        $task['attach_count'] = $am->countByField('task_id', $id);

        $lm = new tasksTaskLogModel();
        $task['log_count'] = $lm->countByField('task_id', $id);

        $comments = $lm->getTaskComments($id);
        $texts = waUtils::getFieldValues($comments, 'text');
        $texts_hash = md5(join('|', $texts));
        $task['log_texts_hash'] = $texts_hash;

        return $task;
    }
}
