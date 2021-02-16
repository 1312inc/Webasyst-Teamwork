<?php

class tasksTasksDeleteController extends waJsonController
{
    public function execute()
    {
        $ids = $this->getTaskIds();
        if (!$ids) {
            return;
        }

        $task_model = new tasksTaskModel();
        $task_relation_model = new tasksTaskRelationsModel();
        $tasks_task_tags_model = new tasksTaskTagsModel();
        $tasks_tags_model = new tasksTagModel();


        /**
         * @event task_delete
         * @param array [string]mixed $params
         * @param array [string]array $params['ids'] Array of IDs of deleting task entries
         * @return void
         */
        $params = array('ids' => $ids);
        wa()->event('task_delete', $params);

        $task_model->delete($ids);

        $task_relation_model->deleteRelation($ids);
        $tasks_task_tags_model->deleteByField(array(
            'task_id' => $ids
        ));
        $tasks_tags_model->deleteUnusedTags();

        $this->logAction('task_delete', count($ids));
    }

    protected function getTaskIds()
    {
        $id = wa()->getRequest()->post('id');
        $ids = tasksHelper::toIntArray($id);
        $ids = tasksHelper::dropNotPositive($ids);

        $task_model = new tasksTaskModel();
        $tasks = $task_model->getById($ids);

        $rights = new tasksRights();
        $rights->extendTasksByRightsInfo($tasks);

        $task_ids = array();
        foreach ($tasks as $task) {
            if ($task['rights_info']['can_delete']) {
                $task_ids[] = $task['id'];
            }
        }

        return $task_ids;

    }
}
