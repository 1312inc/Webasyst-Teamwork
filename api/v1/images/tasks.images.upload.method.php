<?php

class tasksImagesUploadMethod extends tasksApiAbstractMethod
{
    protected $method = self::METHOD_POST;

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        $uuid = $this->post('task_uuid', true);

        $oks = [];
        $errors = [];
        foreach (waRequest::file('image') as $image) {
            list($imageUrl, $errormsg) = $this->saveImage($image, $uuid);
            if ($imageUrl) {
                $oks[$image->name] = $imageUrl;
            } else {
                if ($image->name) {
                    $errors[$image->name] = $errormsg;
                } else {
                    $errors[] = $errormsg;
                }
            }
        }

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, ($oks ? [
            'files' => $oks,
        ] : []) + ($errors ? [
            'errors' => $errors,
        ] : []));
    }

    protected function saveImage(waRequestFile $file, $uuid)
    {
        if (!$file->uploaded()) {
            return [false, sprintf(_w('Failed to upload image %s.'), $file->name) . ' (' . $file->error . ')'];
        }

        $file->transliterateFilename();
        $path = tasksHelper::getRedactorImagesDataPath($uuid, true);
        $imageName = sprintf('%s.%s', microtime(true), $file->extension);

        try {
            $image = $file->waImage();
            $image = $image->resize(tsks()->getOption('redactor_image_size'));
            $image->save($path . $imageName);
            return [tasksHelper::getRedactorImagesUrl($uuid, true) . $imageName, ''];
        } catch (Throwable $exception) {
            waLog::log(
                sprintf(
                    'Tasks save image redactor attachment error: %s. %s',
                    $exception->getMessage(),
                    $exception->getTraceAsString()
                ),
                'tasks/error.log'
            );
        }

        return [false, sprintf(_w('Failed to upload image %s.'), $file->name) . ' (' . $file->error . ')'];
    }
}
