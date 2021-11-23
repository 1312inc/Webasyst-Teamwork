<?php

class tasksTasksFavoriteMethod extends tasksApiAbstractMethod
{
    protected $method = self::METHOD_POST;

    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiTasksFavoriteRequest(
            $this->post('task_id', true, self::CAST_INT),
            $this->post('favorite', true, self::CAST_BOOLEAN),
            $this->post('contact_id', false, self::CAST_INT) ?: wa()->getUser()->getId()
        );

        if ((new tasksApiTasksFavoriteHandler())->favorite($request)) {
            return new tasksApiResponse();
        }

        return new tasksApiErrorResponse('Some error on favorite');
    }
}
