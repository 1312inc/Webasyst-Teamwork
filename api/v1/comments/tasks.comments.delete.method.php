<?php

class tasksCommentsDeleteMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST, self::METHOD_DELETE];

    /**
     * @return tasksApiResponseInterface
     * @throws tasksAccessException
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksException
     * @throws tasksResourceNotFoundException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiCommentDeleteRequest($this->post('id', true, self::CAST_INT));

        if ((new tasksApiCommentDeleteHandler())->delete($request)) {
            return new tasksApiResponse();
        }

        throw new tasksException(tasksApiResponseInterface::RESPONSE_FAIL);
    }
}
