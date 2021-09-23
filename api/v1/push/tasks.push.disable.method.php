<?php

class tasksPushDisableMethod extends tasksApiAbstractMethod
{
    protected $method = self::METHOD_POST;

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     */
    function run(): tasksApiResponseInterface
    {
        $request = new tasksApiPushDisableRequest(
            $this->post('client_id', true, self::CAST_STRING_TRIM)
        );

        if ((new tasksApiPushDisableHandler())->handle($request)) {
            return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, tasksApiResponseInterface::RESPONSE_OK);
        }

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_FAIL, 'Disable error');
    }
}
