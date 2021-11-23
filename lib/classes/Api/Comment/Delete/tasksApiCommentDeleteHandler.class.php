<?php

final class tasksApiCommentDeleteHandler
{
    /**
     * @param tasksApiCommentDeleteRequest $deleteRequest
     *
     * @return bool
     * @throws tasksAccessException
     * @throws tasksResourceNotFoundException
     * @throws waException
     */
    public function delete(tasksApiCommentDeleteRequest $deleteRequest): bool
    {
        $comment = tsks()->getModel('tasksTaskLog')
            ->getComment($deleteRequest->getCommentId());

        if (!$comment) {
            throw new tasksResourceNotFoundException('Comment not found');
        }

        if (!$this->checkCanDelete($comment)) {
            throw new tasksAccessException('Not allowed');
        }

        return tsks()->getModel('tasksTaskLog')
            ->delete($deleteRequest->getCommentId());
    }

    private function checkCanDelete($comment)
    {
        return (new tasksRights())->canDeleteLogItem($comment);
    }
}
