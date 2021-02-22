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
        $request = new tasksApiProjectArchiveRequest((int) $this->post('id', true), new DateTimeImmutable());

        (new tasksApiProjectArchiveHandler())->archive($request);

        return new tasksApiResponse();
    }
}
