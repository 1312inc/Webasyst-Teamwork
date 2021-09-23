<?php

class tasksPushEnableMethod extends tasksApiAbstractMethod
{
    protected $method = self::METHOD_POST;

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksException
     * @throws waException
     */
    function run(): tasksApiResponseInterface
    {
        $request = new tasksApiPushEnableRequest(
            $this->post('client_id', true, self::CAST_STRING_TRIM),
            $this->param('access_token', false, self::CAST_STRING_TRIM),
            wa()->getUser()
        );

        if ((new tasksApiPushEnableHandler())->handle($request)) {
            return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, tasksApiResponseInterface::RESPONSE_OK);
        }

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_FAIL, 'Enable error');
    }
}
