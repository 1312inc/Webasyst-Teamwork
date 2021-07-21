<?php

class tasksTasksUpdateMethod extends tasksApiAbstractMethod
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
        $request = new tasksApiTasksUpdateRequest(
            $this->post('id', true, self::CAST_INT),
            $this->post('name', true, self::CAST_STRING),
            $this->post('text', true, self::CAST_STRING),
            $this->post('assigned_contact_id', true, self::CAST_INT),
            $this->post('project_id', true, self::CAST_INT),
            $this->post('milestone_id', true, self::CAST_INT),
            $this->post('priority', true, self::CAST_INT) ?? 0,
            $this->post('status_id', true, self::CAST_INT) ?? 0,
            $this->post('hidden_timestamp', true, self::CAST_INT) ?? 0,
            $this->post('due_date', true, self::CAST_DATETIME, 'Y-m-d'),
            $this->post('files_hash', true, self::CAST_STRING_TRIM)
        );

        $task = (new tasksApiTasksUpdateHandler())->update($request);

        $collection = new tasksCollection([$task->getId()]);
        $tasks = $collection->getTasks(tasksCollection::FIELDS_TO_GET);

        return new tasksApiTaskResponse(reset($tasks));
    }
}
