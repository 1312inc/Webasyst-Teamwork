<?php

class tasksMilestonesSaveController extends waJsonController
{
    public function execute()
    {
        if (!$this->getUser()->isAdmin('tasks')) {
            $this->setError(_w('Access denied'));
            return;
        }

        $milestone_id = waRequest::post('milestone_id', null, waRequest::TYPE_INT);
        $data = [
            'start_date' => waRequest::post('start_date', null, waRequest::TYPE_STRING_TRIM),
            'end_date' => waRequest::post('end_date', null, waRequest::TYPE_STRING_TRIM),
            'due_date' => waRequest::post('due_date', null, waRequest::TYPE_STRING_TRIM)
        ];

        $model = new tasksMilestoneModel();
        if ($milestone = $model->getById($milestone_id)) {
            foreach ($data as $_field => $value) {
                if ($value) {
                    try {
                        $ts = strtotime($value);
                        $milestone[$_field] = date('Y-m-d', $ts);
                    } catch (Exception $exception) {
                        $milestone[$_field] = null;
                    }
                }
            }

            $result = $model->updateById($milestone_id, $milestone);
        } else {
            $this->setError(_w('Milestone not found'));
            return;
        }

        $this->response = [
            'success' => $result
        ];
    }
}
