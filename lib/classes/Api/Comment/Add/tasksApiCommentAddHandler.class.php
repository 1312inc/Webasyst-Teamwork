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

        tsks()->getModel(tasksTask::class)
            ->update($addRequest->getTaskId(), ['comment_log_id' => $log['id']]);

        (new tasksWaLogManager())->logAction(
            tasksWaLogManager::LOG_COMMENT,
            sprintf(
                '%d:%d:%s',
                $addRequest->getTaskId(),
                $log['id'],
                json_encode(['comment_text' => $addRequest->getText()], JSON_UNESCAPED_UNICODE)
            )
        );

        return $log;
    }
}
