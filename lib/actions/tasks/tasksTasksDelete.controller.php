<?php

class tasksTasksDeleteController extends waJsonController
{
    public function execute()
    {
        $id = wa()->getRequest()->post('id');
        if (!is_array($id)) {
            $id = [$id];
        }

        (new tasksApiTaskDeleteHandler())->delete(new tasksApiTaskDeleteRequest($id));
    }
}
