<?php

class tasksKanbanLimitSaveController extends waJsonController
{
    public function execute()
    {
        $milestone_id = waRequest::post('milestone_id', null, waRequest::TYPE_INT);
        $status_id = waRequest::post('status_id', null, waRequest::TYPE_INT);
        $limit = waRequest::post('limit', null, waRequest::TYPE_INT);

        $tasks_milestone_ext_model = new tasksMilestoneExtModel();
        if ($tasks_milestone_ext_model->getByField(['status_id' => $status_id, 'milestone_id' => $milestone_id])) {
            $tasks_milestone_ext_model->updateByField([
                    'status_id' => $status_id,
                    'milestone_id' => $milestone_id
                ], [
                    'limit' => $limit
                ]
            );
        } else {
            $tasks_milestone_ext_model->insert([
                'status_id'    => $status_id,
                'milestone_id' => $milestone_id,
                'limit'        => $limit
            ]);
        }
    }
}
