<?php

class tasksTagsGetListMethod extends tasksApiAbstractMethod
{
    /**
     * @return tasksApiResponseInterface
     */
    public function run(): tasksApiResponseInterface
    {
        $tags = (new tasksApiTagGetListHandler())->getTags();

        return new tasksApiTagGetListResponse($tags);
    }
}
