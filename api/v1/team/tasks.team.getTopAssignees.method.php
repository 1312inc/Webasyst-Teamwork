<?php

class tasksTeamGetTopAssigneesMethod extends tasksApiAbstractMethod
{
    /**
     * @throws tasksApiMissingParamException
     * @throws waException
     * @throws tasksApiWrongParamException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiTeamGetTopAssigneesRequest(
            $this->get('create_contact_id', true, self::CAST_INT),
            $this->get('project_id', true, self::CAST_INT),
            $this->get('status_id', false, self::CAST_INT)
        );

        return new tasksApiTeamGetTopAssigneesResponse((new tasksApiTeamGetTopAssigneesHandler())->getUsers($request));
    }
}
