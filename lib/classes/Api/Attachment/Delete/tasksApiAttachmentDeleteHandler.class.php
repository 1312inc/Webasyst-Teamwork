<?php

final class tasksApiAttachmentDeleteHandler
{
    /**
     * @param tasksApiAttachmentDeleteRequest $deleteRequest
     *
     * @return bool
     * @throws tasksResourceNotFoundException
     * @throws waException
     */
    public function delete(tasksApiAttachmentDeleteRequest $deleteRequest): bool
    {
        $tasksAttachmentModel = tsks()->getModel('tasksAttachment');

        $attach = $tasksAttachmentModel->getById($deleteRequest->getId());
        if (!$attach) {
            throw new tasksResourceNotFoundException('Attachment not found');
        }

        waFiles::delete(tasksHelper::getAttachPath($attach));

        return $tasksAttachmentModel->deleteById($deleteRequest->getId());
    }
}
