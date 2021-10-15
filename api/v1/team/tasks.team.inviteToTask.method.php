<?php

class tasksTeamInviteToTaskMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST];

    /**
     * @throws tasksAccessException
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksResourceNotFoundException
     */
    public function run(): tasksApiResponseInterface
    {
         $request = new tasksApiTeamInviteToTaskRequest(
            new tasksValueEmail($this->post('email', true, self::CAST_STRING_TRIM)),
            $this->post('task_id', true, self::CAST_INT),
            $this->post('access_right', false, self::CAST_INT) ?? 0
        );

        $result = (new tasksApiTeamInviteToTaskHandler())->invite($request);

        if (!$result) {
            return new tasksApiErrorResponse('Error on invite');
        }

        if (!$result->getContactId()) {
            return new tasksApiErrorResponse($result->getErrorDescription());
        }

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, ['contact' => $result->getContactId()]);
    }
}
