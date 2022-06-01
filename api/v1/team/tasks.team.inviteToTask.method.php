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
        $email = $this->post('email', false, self::CAST_STRING_TRIM);
        if ($email) {
            $email = new tasksValueEmail($email);
        }

        $phone = $this->post('phone', false, self::CAST_STRING_TRIM);
        if ($phone) {
            $phone = new tasksValuePhone($phone);
        }

         $request = new tasksApiTeamInviteToTaskRequest(
            $email,
            $phone,
            $this->post('task_id', true, self::CAST_INT),
            $this->post('access_right', false, self::CAST_INT) ?? 0
        );

        $result = (new tasksApiTeamInviteToTaskHandler())->invite($request);

        if (!$result->getContactId()) {
            return new tasksApiErrorResponse($result->getErrorDescription());
        }

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, ['contact' => $result->getContactId()]);
    }
}
