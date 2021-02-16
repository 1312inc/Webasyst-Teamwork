<?php

class tasksProjectsAddMethod extends tasksApiAbstractMethod
{
    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     * @throws tasksException
     */
    public function run(): tasksApiResponseInterface
    {
        if ($archive_datetime = $this->post('archive_datetime')) {
            $archive_datetime = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $archive_datetime);
            if (!$archive_datetime) {
                throw new tasksApiWrongParamException('archive_datetime', 'Datetime format: Y-m-d H:i:s');
            }
        }

        $workflow = $this->post('workflow', true);

        $request = new tasksApiProjectAddRequest(
            $this->post('name', true),
            $this->post('icon'),
            $this->post('color'),
            $archive_datetime,
            $this->post('icon_url'),
            $this->post('sort') ?: 0,
            $workflow
                ? array_fill_keys(explode(',', $workflow), 1)
                : $this->post('workflow_custom')
        );

        return new tasksApiProjectAddResponse((new tasksApiProjectAddHandler())->add($request));
    }
}
