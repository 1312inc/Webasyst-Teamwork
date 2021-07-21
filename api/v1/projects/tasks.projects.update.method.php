<?php

class tasksProjectsUpdateMethod extends tasksApiAbstractMethod
{
    protected $method = self::METHOD_POST;

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksException
     * @throws waException
     */
    public function run(): tasksApiResponseInterface
    {
        if ($workflow = $this->post('workflow')) {
            if (!is_array($workflow)) {
                throw new tasksApiWrongParamException('workflow', 'Should by array');
            }
            array_map('intval', $workflow);
            $workflow = array_flip($workflow);
        }

        $request = new tasksApiProjectUpdateRequest(
            (int) $this->post('id', true),
            $this->post('name', true),
            $this->post('icon', true),
            $this->post('color', true),
            $this->post('icon_url', true),
            $this->post('sort', true),
            $workflow
        );

        return new tasksApiProjectResponse((new tasksApiProjectUpdateHandler())->update($request));
    }
}
