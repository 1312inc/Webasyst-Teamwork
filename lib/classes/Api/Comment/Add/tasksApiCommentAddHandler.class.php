<?php

final class tasksApiCommentAddHandler
{
    public function add(tasksApiCommentAddRequest $addRequest): ?array
    {
        $task = tsks()->getModel(tasksTask::class)
            ->getById($addRequest->getTaskId());
        if (!$task) {
            throw new tasksResourceNotFoundException('Task not found');
        }

        $log = tasksHelper::addLog(
            $task,
            [
                'action' => tasksTaskLogModel::ACTION_TYPE_COMMENT,
                'attachments_hash' => $addRequest->getFilesHash(),
                'text' => $addRequest->getText(),
            ]
        );

        tsks()->getModel('waLog')
            ->add('task_comment', sprintf('%d:%d', $addRequest->getTaskId(), $log['id']));

        tsks()->getModel(tasksTask::class)
            ->update($addRequest->getTaskId(), ['comment_log_id' => $log['id']]);

        return $log;
    }
}
