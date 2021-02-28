<?php

class tasksTasksAddMethod extends tasksApiAbstractMethod
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
        $request = new tasksApiTasksAddRequest(
            $this->post('name', true, self::CAST_STRING),
            $this->post('text', true, self::CAST_STRING),
            $this->post('assigned_contact_id', true, self::CAST_INT),
            $this->post('project_id', true, self::CAST_INT),
            $this->post('milestone_id', true, self::CAST_INT),
            $this->post('priority', true, self::CAST_INT),
            $this->post('status_id', true, self::CAST_INT),
            $this->post('hidden_timestamp', true, self::CAST_INT),
            $this->post('due_date', true, self::CAST_DATETIME, 'Y-m-d')
        );

        return new tasksApiProjectResponse((new tasksApiProjectAddHandler())->add($request));
    }
}
