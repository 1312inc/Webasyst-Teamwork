<?php

class tasksProjectModel extends waModel
{
    protected $table = 'tasks_project';

    public function add($data)
    {
        if (empty($data['contact_id'])) {
            $data['contact_id'] = wa()->getUser()->getId();
        }
        $data['create_datetime'] = date('Y-m-d H:i:s');

        return $this->insert($data);
    }

    public function recountTasksNumber($id): void
    {
        if (!wa_is_int($id)) {
            return;
        }

        $this->updateById($id, [
            'tasks_number' => new waModelExpr(
                'GREATEST(tasks_number , (SELECT IFNULL(MAX(number), 0) FROM tasks_task WHERE project_id = ' . $id . '))'
            ),
        ]);
    }
}
