<?php

class tasksTasksGetListMethod extends tasksApiAbstractMethod
{
    private const MAX_LIMIT = 500;

    /**
     * @return tasksApiResponseInterface
     * @throws tasksApiMissingParamException
     * @throws tasksApiWrongParamException
     */
    public function run(): tasksApiResponseInterface
    {
        $limit = $this->get('limit')
            ? $this->get('limit', false, self::CAST_INT)
            : tasksOptions::getTasksPerPage();

        if ($limit > self::MAX_LIMIT) {
            throw new tasksApiWrongParamException('limit', sprintf('Limit can`t be over %d', self::MAX_LIMIT));
        }

        $filter = new tasksApiTaskGetListRequest(
            $this->get('hash', true, self::CAST_STRING),
            $this->get('filters', false, self::CAST_STRING_TRIM),
            $this->get('offset', true, self::CAST_INT),
            $limit,
            $this->get('since')
                ? $this->get('since', false, self::CAST_INT)
                : null,
            $this->get('order', false, self::CAST_STRING_TRIM)
        );

        return (new tasksApiTaskGetListHandler())->getTasks($filter);
    }
}
