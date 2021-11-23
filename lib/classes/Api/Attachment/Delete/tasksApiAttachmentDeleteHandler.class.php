<?php

final class tasksApiAttachmentDeleteHandler
{
    /**
     * @param tasksApiAttachmentDeleteRequest $deleteRequest
     *
     * @return bool
     * @throws waException
     */
    public function delete(tasksApiAttachmentDeleteRequest $deleteRequest): bool
    {
        $tasksAttachmentModel = tsks()->getModel('tasksAttachment');
        $rights = new tasksRights();

        foreach ($deleteRequest->getIds() as $id) {
            $attach = $tasksAttachmentModel->getById($id);
            if (!$attach) {
                continue;
            }

            if (!$rights->canEditTask($attach['task_id'])) {
                continue;
            }

            if (!empty($attach['log_id']) && !$rights->canEditLogItem($attach['log_id'])) {
                continue;
            }

            waFiles::delete(tasksHelper::getAttachPath($attach));

            $tasksAttachmentModel->deleteById($id);
        }

        return true;
    }
}
