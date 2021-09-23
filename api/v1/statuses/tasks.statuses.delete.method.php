<?php

class tasksStatusesDeleteMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST, self::METHOD_DELETE];

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
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }

        $request = new tasksApiStatusDeleteRequest($this->post('id', true, self::CAST_INT));

        (new tasksApiStatusDeleteHandler())->delete($request);

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, tasksApiResponseInterface::RESPONSE_OK);
    }
}
