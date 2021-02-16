<?php

class tasksAttachmentsUploadController extends waJsonController
{
    public function execute()
    {
        $hash = (string)wa()->getRequest()->post('hash');
        if (!$hash) {
            return;
        }
        foreach (waRequest::file('files') as $f) {
            if (!$this->saveFile($f, $hash)) {
                $this->errors[] = sprintf(_w('Failed to upload file %s.'), $f->name).' ('.$f->error.')';
            }
        }
    }

    protected function saveFile(waRequestFile $f, $hash)
    {
        if (!$f->uploaded()) {
            return false;
        }
        $temp_path = wa('tasks')->getTempPath('files', 'tasks');
        $mail_dir = $temp_path.'/'.$hash;
        waFiles::create($mail_dir);
        if (!$f->moveTo($mail_dir, $f->name)) {
            return false;
        }
        return true;
    }
}
