<?php

class tasksMilestonesDeleteMethod extends tasksApiAbstractMethod
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
        $request = new tasksApiMilestoneDeleteRequest($this->post('id', true, self::CAST_INT));

        (new tasksApiMilestoneDeleteHandler())->delete($request);

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, tasksApiResponseInterface::RESPONSE_OK);
    }
}
