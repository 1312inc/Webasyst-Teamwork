<?php

class tasksTasksInvertRelationsController extends waJsonController
{
    public function execute()
    {
        $parent_id = waRequest::post('parent_id', null, waRequest::TYPE_INT);
        $child_id = waRequest::post('child_id', null, waRequest::TYPE_INT);

        $invert = false;
        if ($parent_id && $child_id) {
            $task_relation_model = new tasksTaskRelationsModel();
            $invert = $task_relation_model->updateByField(array(
                'parent_id' => $parent_id,
                'child_id'  => $child_id,
            ), array(
                'parent_id' => $child_id,
                'child_id'  => $parent_id,
            ));
        }

        $this->response['invert'] = $invert;
    }
}
