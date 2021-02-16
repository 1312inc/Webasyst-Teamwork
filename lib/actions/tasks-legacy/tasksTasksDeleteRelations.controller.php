<?php

class tasksTasksDeleteRelationsController extends waJsonController
{
    public function execute()
    {
        $parent_id = waRequest::post('parent_id', null, waRequest::TYPE_INT);
        $child_id = waRequest::post('child_id', null, waRequest::TYPE_INT);

        $delete = false;
        $update = false;

        if ($parent_id && $child_id) {
            $task_relation_model = new tasksTaskRelationsModel();
            $delete = $task_relation_model->deleteByField(array(
                'parent_id' => $parent_id,
                'child_id'  => $child_id,
            ));

            if ($delete) {
                $task_task_model = new tasksTaskModel();
                $tasks = $task_task_model->getById(array($parent_id, $child_id));
                $text = $this->escapeChildNumber($tasks, $parent_id, $child_id);
                $update = $task_task_model->updateById($parent_id, array('text' => $text));
            }
        }

        $this->response['delete'] = $delete;
        $this->response['update'] = $update;
    }


    /**
     * @param $tasks
     * @param $parent_id
     * @param $child_id
     * @return mixed|null|string|string[]
     */
    protected function escapeChildNumber($tasks, $parent_id, $child_id)
    {
        $text = ifset($tasks, $parent_id, 'text', null);

        if (!empty($tasks[$child_id]) && isset($tasks[$parent_id]['text'])) {
            $task_number = $tasks[$child_id]['project_id'].'.'.$tasks[$child_id]['number'];

            $task_number = preg_quote($task_number);
            $regex = '~(^|\s)(#'.$task_number.'([^0-9]|$))~';
            $text = preg_replace($regex, '\1#\2', $text);
        }

        return $text;
    }
}
