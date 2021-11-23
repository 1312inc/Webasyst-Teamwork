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
            $this->post('name', true, self::CAST_STRING_TRIM),
            $this->post('icon', false, self::CAST_STRING_TRIM),
            $this->post('color', false, self::CAST_STRING_TRIM),
            $this->post('icon_url', false, self::CAST_STRING_TRIM),
            (int) $this->post('sort', false, self::CAST_INT),
            $workflow,
            $this->post('icon_hash', false, self::CAST_STRING_TRIM)
        );

        return new tasksApiProjectResponse((new tasksApiProjectAddHandler())->add($request));
    }
}
