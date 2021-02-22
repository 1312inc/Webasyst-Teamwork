<?php

class tasksMilestonesArchiveMethod extends tasksApiAbstractMethod
{
    protected $method = self::METHOD_POST;

    /**
     * @return tasksApiResponseInterface
     * @throws tasksAccessException
     * @throws tasksApiMissingParamException
     * @throws tasksException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiMilestoneArchiveRequest(
            (int) $this->post('id', true),
            (bool) $this->post('archive')
        );

        (new tasksApiMilestoneArchiveHandler())->archive($request);

        return new tasksApiResponse();
    }
}
