<?php

final class tasksApiAttachmentDownloadHandler
{
    /**
     * @param tasksApiAttachmentDownloadRequest $downloadRequest
     *
     * @throws tasksResourceNotFoundException
     * @throws waException
     */
    public function download(tasksApiAttachmentDownloadRequest $downloadRequest): void
    {
        $tasksAttachmentModel = tsks()->getModel('tasksAttachment');

        $attach = $tasksAttachmentModel->getById($downloadRequest->getId());
        if (!$attach) {
            throw new tasksResourceNotFoundException('Attachment not found');
        }

        wa()->getResponse()->addHeader("Cache-Control", "private, no-transform");
        $path = tasksHelper::getAttachPath($attach);
        waFiles::readFile($path, $attach['name']);
    }
}
