<?php

class tasksProjectsAddMethod extends tasksApiAbstractMethod
{
    protected $method = self::METHOD_POST;

    /**
     * @return tasksApiResponseInterface|cashApiAbstractResponse
     * @throws tasksAccessException
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        $workflow = $this->post('workflow', true, self::CAST_ARRAY);
        if (!is_array($workflow)) {
            throw new tasksApiWrongParamException('workflow', 'Should by array');
        }
        array_map('intval', $workflow);
        $workflow = array_flip($workflow);

        $request = new tasksApiProjectAddRequest(
            $this->post('name', true),
            $this->post('icon'),
            $this->post('color'),
            $this->post('icon_url'),
            $this->post('sort') ?: 0,
            $workflow
        );

        return new tasksApiProjectResponse((new tasksApiProjectAddHandler())->add($request));
    }
}
