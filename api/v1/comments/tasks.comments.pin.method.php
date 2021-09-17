<?php

class tasksCommentPinMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST];

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksException
     * @throws tasksResourceNotFoundException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiCommentPinRequest(
            $this->post('task_id', true, self::CAST_INT),
            $this->post('id', true, self::CAST_INT)
        );

        if ((new tasksApiCommentPinHandler())->pin($request)) {
            return new tasksApiResponse();
        }

        throw new tasksException(tasksApiResponseInterface::RESPONSE_FAIL);
    }
}
