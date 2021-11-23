<?php

class tasksMilestonesAddMethod extends tasksApiAbstractMethod
{
    protected $method = self::METHOD_POST;

    /**
     * @return tasksApiResponseInterface
     * @throws tasksAccessException
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiMilestoneAddRequest(
            $this->post('name', true, self::CAST_STRING_TRIM),
            $this->post('description') ?? '',
            $this->post('project_id', true, self::CAST_INT),
            $this->post('due_date', false, self::CAST_DATETIME, 'Y-m-d')
        );

        return new tasksApiMilestoneResponse((new tasksApiMilestoneAddHandler())->add($request));
    }
}
