<?php

class tasksAttachmentsDownloadController extends waController
{
    public function execute()
    {
        $id = waRequest::get('id');
        $attach_model = new tasksAttachmentModel();
        $attach = $attach_model->getById($id);

        if (!$attach) {
            throw new waException(_w('File not found'), 404);
        }

        wa()->getResponse()->addHeader("Cache-Control", "private, no-transform");
        $path = tasksHelper::getAttachPath($attach);
        waFiles::readFile($path, $attach['name']);
    }
}