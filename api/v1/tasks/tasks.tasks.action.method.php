<?php

class tasksTasksActionMethod extends tasksApiAbstractMethod
{
    protected $method = self::METHOD_POST;

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksException
     * @throws tasksResourceNotFoundException
     * @throws tasksValidationException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        $action = $this->post('action', true, self::CAST_ENUM, tasksApiTasksActionRequest::ALLOWED_ACTION);
        $statusId = $this->post('status_id', false, self::CAST_INT) ?? 0;

        if ($action == tasksApiTasksActionRequest::ACTION_TYPE_CLOSE) {
            $action = tasksTaskLogModel::ACTION_TYPE_EMPTY;
            $statusId = tasksStatusModel::STATUS_CLOSED_ID;
        }

        $request = new tasksApiTasksActionRequest(
            $this->post('id', true, self::CAST_INT),
            $action,
            $this->post('text', false, self::CAST_STRING),
            $this->post('files_hash', false, self::CAST_STRING_TRIM),
            $this->post('assigned_contact_id', false, self::CAST_INT),
            $statusId
        );

        $logData = (new tasksApiTasksActionHandler())->action($request);
        $logResponse = tasksApiLogDtoFactory::createFromArrayWithAttachmentsFetch($logData);

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, $logResponse);
    }
}
