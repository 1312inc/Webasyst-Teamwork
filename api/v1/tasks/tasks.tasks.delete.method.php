<?php

class tasksTasksDeleteMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST, self::METHOD_DELETE];

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiTaskDeleteRequest($this->post('ids', true, self::CAST_ARRAY));

        $deletedIds = (new tasksApiTaskDeleteHandler())->delete($request);

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, ['ids' => $deletedIds]);
    }
}
