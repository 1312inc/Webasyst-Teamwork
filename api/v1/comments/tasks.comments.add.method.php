<?php

class tasksCommentsAddMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST, self::METHOD_PUT];

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksResourceNotFoundException
     * @throws waException
     * @throws waRightsException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiCommentAddRequest(
            $this->post('task_id', true, self::CAST_INT),
            $this->post('text', true, self::CAST_STRING),
            $this->post('files_hash', false, self::CAST_STRING_TRIM)
        );

        $logData = (new tasksApiCommentAddHandler())->add($request);
        $logResponse = tasksApiLogDtoFactory::createFromArrayWithAttachmentsFetch($logData);

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, $logResponse);
    }
}
