<?php

final class tasksApiAttachmentAddHandler
{
    /**
     * @param tasksApiAttachmentAddRequest $addRequest
     *
     * @return array<string>
     * @throws waException
     */
    public function add(tasksApiAttachmentAddRequest $addRequest): array
    {
        $task = null;
        if ($addRequest->getTaskId()) {
            $task = (new tasksTaskModel())->getById($addRequest->getTaskId());
            if (!$task) {
                throw new tasksResourceNotFoundException('Task not found');
            }
        }

        $tempPath = wa(tasksConfig::APP_ID)->getTempPath('files', tasksConfig::APP_ID);

        $ok = [];
        foreach ($addRequest->getFiles() as $file) {
            if (!$file->uploaded()) {
                continue;
            }

            $uploadPath = $tempPath . '/' . $addRequest->getHash();
            waFiles::create($uploadPath);
            if (!$file->moveTo($uploadPath, $file->name)) {
                continue;
            }
            $ok[] = $file->name;
        }

        if ($ok && $task) {
            (new tasksAttachmentModel())->addAttachmentsByHash($addRequest->getTaskId(), null, $addRequest->getHash());
        }

        return $ok;
    }
}
