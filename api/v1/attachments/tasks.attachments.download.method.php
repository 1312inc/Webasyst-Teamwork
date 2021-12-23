<?php

class tasksAttachmentsDownloadMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST, self::METHOD_GET];

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksResourceNotFoundException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiAttachmentDownloadRequest($this->get('id', true, self::CAST_INT));

        (new tasksApiAttachmentDownloadHandler())->download($request);

        throw new tasksResourceNotFoundException('File not found');
    }
}
