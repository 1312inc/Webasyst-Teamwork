<?php

class tasksMilestonesGetListMethod extends tasksApiAbstractMethod
{
    /**
     * @return tasksApiResponseInterface
     */
    public function run(): tasksApiResponseInterface
    {
        return new tasksApiMilestonesResponse((new tasksApiMilestoneGetListHandler())->getMilestones());
    }
}
