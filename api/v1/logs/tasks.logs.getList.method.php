<?php

class tasksLogsGetListMethod extends tasksApiAbstractMethod
{
    /**
     * @return tasksApiResponseInterface
     * @throws cashValidateException
     * @throws tasksApiMissingParamException
     */
    public function run(): tasksApiResponseInterface
    {
        $request = new tasksApiLogGetListRequest(
            $this->get('project_id', false, self::CAST_INT),
            $this->get('contact_id', false, self::CAST_INT),
            $this->get('milestone_id', false, self::CAST_INT),
            $this->get('offset', true, self::CAST_INT),
            $this->get('limit')
                ? $this->get('limit', false, self::CAST_INT)
                : (int) tsks()->getOption('logs_per_page')
        );

        return new tasksApiLogGetListResponse((new tasksApiLogGetListHandler())->getLogs($request));
    }
}
