<?php

class tasksProjectsDeleteMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST, self::METHOD_DELETE];

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiProjectDeleteRequest( $this->post('id', true, self::CAST_INT));

        (new tasksApiProjectDeleteHandler())->delete($request);

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, tasksApiResponseInterface::RESPONSE_OK);
    }
}
