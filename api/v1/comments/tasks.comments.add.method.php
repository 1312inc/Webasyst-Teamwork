<?php

class tasksCommentsAddMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST, self::METHOD_PUT];

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws waAPIException
     * @throws waException
     * @throws waRightsException
     */
    public function run(): tasksApiResponseInterface
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }

        $request = new tasksApiCommentAddRequest(
            $this->post('task_id', true, self::CAST_INT),
            $this->post('text', true, self::CAST_STRING),
            $this->post('files_hash', false, self::CAST_STRING_TRIM)
        );

        $logData = (new tasksApiCommentAddHandler())->add($request);
        $logResponse = tasksApiLogDtoFactory::createFromArrayWithAttachments($logData);

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, $logResponse);
    }
}
