<?php

class tasksTasksGetListMethod extends tasksApiAbstractMethod
{
    /**
     * @return tasksApiResponseInterface
     * @throws cashValidateException
     * @throws tasksApiMissingParamException
     */
    public function run(): tasksApiResponseInterface
    {
        $filter = new tasksApiTaskGetListRequest(
            (string) $this->get('hash'),
            (string) $this->get('filters'),
            (int) $this->get('offset'),
            $this->get('limit')
                ? (int) $this->get('limit')
                : (int) wa(tasksConfig::APP_ID)->getConfig()->getOption('tasks_per_page'),
            $this->get('since') ? (int) $this->get('since') : null,
            (string) $this->get('order')
        );

        return (new tasksApiTaskGetListHandler())->getTasks($filter);
    }
}
