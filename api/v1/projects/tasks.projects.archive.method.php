<?php

class tasksProjectsArchiveMethod extends tasksApiAbstractMethod
{
    protected $method = self::METHOD_POST;

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiProjectArchiveRequest(
            $this->post('id', true, self::CAST_INT),
            $this->post('archive', true, self::CAST_BOOLEAN),
            new DateTimeImmutable()
        );

        (new tasksApiProjectArchiveHandler())->archive($request);

        return new tasksApiResponse(tasksApiResponseInterface::HTTP_OK, tasksApiResponseInterface::RESPONSE_OK);
    }
}
