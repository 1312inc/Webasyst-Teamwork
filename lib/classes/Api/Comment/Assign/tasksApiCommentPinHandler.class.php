<?php

final class tasksApiCommentPinHandler
{
    public function pin(tasksApiCommentPinRequest $assignRequest): bool
    {
        $task = tsks()->getModel(tasksTask::class)
            ->getById($assignRequest->getTaskId());
        if (!$task) {
            throw new tasksResourceNotFoundException('Task not found');
        }

        $comment = tsks()->getModel('tasksTaskLog')
            ->getComment($assignRequest->getCommentId());

        if (!$comment) {
            throw new tasksResourceNotFoundException('Comment not found');
        }

        tsks()->getModel(tasksTask::class)
            ->update($assignRequest->getTaskId(), ['comment_log_id' => $assignRequest->getCommentId()]);

        return true;
    }
}
