<?php

class tasksProjectsGetListMethod extends tasksApiAbstractMethod
{
    /**
     * @return tasksApiResponseInterface
     */
    public function run(): tasksApiResponseInterface
    {
        return new tasksApiProjectsResponse((new tasksApiProjectGetListHandler())->getProjects());
    }
}
