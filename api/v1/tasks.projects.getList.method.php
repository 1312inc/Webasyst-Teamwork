<?php

class tasksProjectsGetListMethod extends tasksApiAbstractMethod
{
    public function run(): tasksApiResponseInterface
    {
        return new tasksApiProjectGetListResponse((new tasksApiProjectGetListHandler())->getProjects());
    }
}
