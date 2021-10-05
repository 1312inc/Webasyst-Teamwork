<?php

final class tasksApiCommentUpdateHandler
{
    // possible actions with that comment can be added
    private const POSSIBLE_ACTION_TYPES = [
        tasksTaskLogModel::ACTION_TYPE_COMMENT,
        tasksTaskLogModel::ACTION_TYPE_FORWARD,
        tasksTaskLogModel::ACTION_TYPE_RETURN,
        tasksTaskLogModel::ACTION_TYPE_EMPTY,
    ];

    /**
     * @param tasksApiCommentUpdateRequest $updateRequest
     *
     * @return array|null
     * @throws tasksAccessException
     * @throws tasksException
     * @throws waException
     */
    public function update(tasksApiCommentUpdateRequest $updateRequest): ?array
    {
        $comment = tsks()->getModel('tasksTaskLog')
            ->getComment($updateRequest->getCommentId(), self::POSSIBLE_ACTION_TYPES);

        if (!$comment) {
            throw new tasksResourceNotFoundException('Comment not found');
        }

        // No need empty comment
        if ($comment['is_empty']) {
            if ($this->deleteComment($comment)) {
                return null;
            }

            throw new tasksException('Error on delete comment');
        }

        tsks()->getModel('tasksTaskLog')
            ->updateById($comment['id'], ['text' => $updateRequest->getText()]);

        if ($updateRequest->getFilesHash()) {
            tsks()->getModel(tasksAttachment::class)
                ->addAttachmentsByHash($comment['task_id'], $comment['id'], $updateRequest->getFilesHash());
        }

        $comment = tsks()->getModel('tasksTaskLog')
            ->getComment($updateRequest->getCommentId(), self::POSSIBLE_ACTION_TYPES);

        if ($comment['is_empty']) {
            // No need empty comment
            if ($this->deleteComment($comment)) {
                return null;
            }

            throw new tasksException('Error on delete comment');
        }

        (new tasksWaLogManager())->logAction(
            tasksWaLogManager::LOG_COMMENT_EDIT,
            sprintf('%d:%d:%s', $comment['task_id'], $comment['id'], $updateRequest->getText())
        );

        return $comment;
    }

    private function deleteComment($comment): bool
    {
        if (!$this->checkCanDelete($comment)) {
            throw new tasksAccessException('Not allowed');
        }

        return tsks()->getModel('tasksTaskLog')
            ->delete($comment['id']);
    }

    private function checkCanDelete($comment): bool
    {
        return (new tasksRights())->canDeleteLogItem($comment);
    }
}
