<?php

class tasksTeamGetMySettingsMethod extends tasksApiAbstractMethod
{
    public function run(): tasksApiResponseInterface
    {
        $me = wa()->getUser();

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, tasksApiMySettingsDto::createFromContact($me));
    }
}
