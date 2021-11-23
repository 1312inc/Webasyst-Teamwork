<?php

class tasksCommentsUpdateMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST, self::METHOD_PUT];

    /**
     * @return tasksApiResponseInterface
     * @throws tasksAccessException
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiCommentUpdateRequest(
            $this->post('id', true, self::CAST_INT),
            $this->post('text', true, self::CAST_STRING_TRIM),
            $this->post('files_hash', false, self::CAST_STRING_TRIM)
        );

        $logData = (new tasksApiCommentUpdateHandler())->update($request);
        if (!$logData) {
            throw new tasksException(tasksApiResponseInterface::RESPONSE_FAIL);
        }

        $logResponse = tasksApiLogDtoFactory::createFromArrayWithAttachmentsFetch($logData);

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, $logResponse);
    }
}
