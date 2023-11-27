<?php

class tasksSettingsGetMethod extends tasksApiAbstractMethod
{
    public function run(): tasksApiResponseInterface
    {
        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, [
            'version' => wa('tasks')->getVersion(),
        ]);
    }
}
