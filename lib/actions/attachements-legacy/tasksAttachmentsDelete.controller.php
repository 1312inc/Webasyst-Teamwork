<?php

class tasksAttachmentsDeleteController extends waJsonController
{
    public function execute()
    {
        $id = waRequest::post('id');
        if (!$id) {
            throw new waException('File not found');
        }

        $attach_model = new tasksAttachmentModel();
        $attach = $attach_model->getById($id);

        if (!$attach) {
            if (!$id) {
                throw new waException('File not found');
            }
        }
        waFiles::delete(tasksHelper::getAttachPath($attach));
        $attach_model->deleteById($id);
    }
}
