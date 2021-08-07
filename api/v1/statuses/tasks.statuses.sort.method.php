<?php

class tasksStatusesSortMethod extends tasksApiAbstractMethod
{
    protected $method = [self::METHOD_POST];

    /**
     * @return tasksApiResponseInterface
     * @throws waRightsException
     */
    public function run(): tasksApiResponseInterface
    {
        if (!wa()->getUser()->isAdmin('tasks')) {
            throw new waRightsException(_w('Access denied'));
        }

        $request = new tasksApiStatusSortRequest(
            $this->post('sorted_ids', true, self::CAST_ARRAY)
        );

        return new tasksApiStatusesResponse((new tasksApiStatusSortHandler())->sort($request));
    }
}
