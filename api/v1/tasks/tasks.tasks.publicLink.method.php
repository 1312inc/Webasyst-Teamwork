<?php

class tasksTasksPublicLinkMethod extends tasksApiAbstractMethod
{
    protected $method = self::METHOD_POST;

    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiTasksPublicLinkRequest(
            $this->post('id', true, self::CAST_INT),
            $this->post('publish', true, self::CAST_BOOLEAN)
        );

        return new tasksApiResponse(
            tasksApiResponseInterface::HTTP_OK,
            (new tasksApiTasksPublicLinkHandler())->publish($request)
        );
    }
}
