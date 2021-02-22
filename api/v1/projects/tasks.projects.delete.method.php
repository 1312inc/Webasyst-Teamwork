<?php

class tasksProjectsDeleteMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST, self::METHOD_DELETE];

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiProjectDeleteRequest((int) $this->post('id', true));

        (new tasksApiProjectDeleteHandler())->delete($request);

        return new tasksApiResponse();
    }
}
