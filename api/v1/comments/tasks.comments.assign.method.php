<?php

class tasksCommentsAssignMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST];

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksResourceNotFoundException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiCommentAssignRequest(
            $this->post('task_id', true, self::CAST_INT),
            $this->post('id', true, self::CAST_INT)
        );

        if ((new tasksApiCommentAssignHandler())->assign($request)) {
            return new tasksApiResponse();
        }

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_FAIL, 'fail');
    }
}
