<?php

class tasksAttachmentsImageUploadController extends waJsonController
{
    public function execute()
    {
        $uuid = waRequest::post('task_uuid', false, waRequest::TYPE_STRING_TRIM);
        if (!$uuid) {
            return;
        }

        foreach (waRequest::file('image') as $image) {
            $imagePath = $this->saveImage($image, $uuid);
            if ($imagePath === false) {
                $this->errors[] = sprintf(_w('Failed to upload image %s.'), $image->name) . ' (' . $image->error . ')';
            }

            $this->response[$image->name] = $imagePath;
        }
    }

    protected function saveImage(waRequestFile $file, $uuid)
    {
        if (!$file->uploaded()) {
            return false;
        }

        $file->transliterateFilename();
        $path = tasksHelper::getRedactorImagesDataPath($uuid, true);
        $imageName = sprintf('%s.%s', microtime(true), $file->extension);

        try {
            $image = $file->waImage();
            $image = $image->resize(tsks()->getOption('redactor_image_size'));

            $image->save($path . $imageName);

            return tasksHelper::getRedactorImagesUrl($uuid, true) . $imageName;
        } catch (waException $exception) {
            waLog::log(
                sprintf(
                    'Tasks save image redactor attachment error: %s. %s',
                    $exception->getMessage(),
                    $exception->getTraceAsString()
                ),
                'tasks/error.log'
            );
        }

        return false;
    }
}
