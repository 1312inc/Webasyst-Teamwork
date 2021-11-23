<?php

class tasksStatusesGetListMethod extends tasksApiAbstractMethod
{
    /**
     * @return tasksApiResponseInterface
     * @throws waRightsException
     */
    public function run(): tasksApiResponseInterface
    {
        return new tasksApiStatusesResponse((new tasksApiStatusGetListHandler())->getStatuses());
    }
}
