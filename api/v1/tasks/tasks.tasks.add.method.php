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
            wa()->getUser()->getId(),
            $this->post('text', false, self::CAST_STRING),
            $this->post('assigned_contact_id', false, self::CAST_INT),
            $this->post('project_id', true, self::CAST_INT),
            $this->post('milestone_id', false, self::CAST_INT),
            $this->post('priority', false, self::CAST_INT) ?? 0,
            $this->post('status_id', false, self::CAST_INT) ?? 0,
            $this->post('hidden_timestamp', false, self::CAST_INT) ?? 0,
            $this->post('due_date', false, self::CAST_DATETIME, 'Y-m-d'),
            $this->post('files_hash', false, self::CAST_STRING_TRIM),
            $this->post('uuid', true, self::CAST_STRING_TRIM)
        );

        $task = (new tasksApiTasksAddHandler())->add($request);

        $collection = new tasksCollection([$task->getId()]);
        $tasks = $collection->getTasks(tasksCollection::FIELDS_TO_GET);

        return new tasksApiTaskResponse(new tasksTask(reset($tasks)));
    }
}
