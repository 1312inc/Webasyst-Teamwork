<?php

class tasksAttachmentsAddMethod extends tasksApiAbstractMethod
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
        $request = new tasksApiAttachmentAddRequest(
            $this->post('hash', true, self::CAST_STRING),
            $this->post('task_id', false, self::CAST_INT),
            iterator_to_array(waRequest::file('files'))
        );

        return new tasksApiResponse(tasksApiResponse::HTTP_OK, (new tasksApiAttachmentAddHandler())->add($request));
    }
}
