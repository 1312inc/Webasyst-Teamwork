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
        $request = new tasksApiMilestoneDeleteRequest((int) $this->post('id', true));

        (new tasksApiMilestoneDeleteHandler())->delete($request);

        return new tasksApiResponse();
    }
}
