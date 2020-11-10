<?php

/**
 * Class tasksTaskRelationsModel
 * Test Path tests/wa-apps/tasks/model/tasksTaskRelationsModelTest.php
 */
class tasksTaskRelationsModel extends waModel
{
    protected $table = 'tasks_task_relations';

    /**
     * WARNING! You can not delete links before saving. They can be inverted and do not correspond to the record in the task
     * @param $task_id
     * @param $new_ids
     * @param $old_ids
     * @return bool
     */
    public function save($task_id, $new_ids, $old_ids = array())
    {
        //delete deleted tasks from the body
        if (!empty($old_ids)) {
            //Find old task in new task. Delete not found task
            $old_diff_ids = array_diff_key($old_ids, $new_ids);
            if ($old_diff_ids) {
                $this->deleteByField(array(
                    'parent_id' => $task_id,
                    'child_id'  => array_keys($old_diff_ids)
                ));
            }
        }

        //Get all relations for this task. It is necessary to exclude re-binding.
        //Prohibits the attachment of a parent to a child
        $all_relation = $this
            ->select('*')
            ->where('parent_id = i:id OR child_id = i:id', array('id' => $task_id))
            ->fetchAll();

        //Find everything related to this task
        if ($all_relation) {
            foreach ($all_relation as $relation) {
                if ($relation['parent_id'] == $task_id) {
                    $old_ids[$relation['child_id']] = array();
                } else {
                    $old_ids[$relation['parent_id']] = array();
                }
            }
        }

        if (!empty($new_ids)) {
            $insert_array = array();

            //Save only new task
            $new_diff_ids = array_diff_key($new_ids, $old_ids);
            if ($new_diff_ids) {
                foreach ($new_diff_ids as $new_id => $new_data) {
                    $insert_array[] = array(
                        'parent_id' => $task_id,
                        'child_id'  => $new_id,
                    );
                }
                $this->multipleInsert($insert_array);
            }
        }

        return true;
    }

    /**
     * Delete task_id for parent and child column
     * @param array|string $task_ids
     * @return bool
     */
    public function deleteRelation($task_ids)
    {
        if (is_string($task_ids)) {
            $task_ids = array($task_ids);
        }

        $placeholder = array('ids' => $task_ids);
        $sql = "DELETE FROM {$this->table} WHERE parent_id IN(i:ids) OR child_id IN(i:ids)";

        $result = $this->query($sql, $placeholder)->result();

        return $result;
    }

    /**
     * @param $task_ids
     * @return array
     */
    public function getRelations($task_ids)
    {
        $tasks = array();

        if (!empty($task_ids)) {

            $tasks_relations_model = new tasksTaskRelationsModel();
            $tasks_model = new tasksTaskModel();
            $all_relation_ids = array();

            $relations = $tasks_relations_model
                ->select('*')
                ->where( "parent_id IN(i:tasks_id) OR child_id IN(i:tasks_id)"
                    , array('tasks_id' => $task_ids))
                ->fetchAll();

            foreach ($relations as $relation) {
                $all_relation_ids[] = $relation['child_id'];
                $all_relation_ids[] = $relation['parent_id'];
            }

            $tasks_row = $tasks_model->getById(array_unique($all_relation_ids));

            foreach ($relations as $relation) {
                $parent_task = ifset($tasks_row, $relation['parent_id'], null);
                $child_task = ifset($tasks_row, $relation['child_id'], null);

                $parent_id = $relation['parent_id'];
                $child_id = $relation['child_id'];

                //Attach child id in parent
                $tasks[$parent_id]['childs'][$child_id] = array(
                    'project'   => ifset($child_task, 'project_id', null),
                    'number'    => ifset($child_task, 'number', null),
                    'name'      => ifset($child_task, 'name', null),
                    'status_id' => ifset($child_task, 'status_id', null)
                );

                //Attach parent id in child
                $tasks[$child_id]['parents'][$parent_id] = array(
                    'project'   => ifset($parent_task, 'project_id', null),
                    'number'    => ifset($parent_task, 'number', null),
                    'name'      => ifset($parent_task, 'name', null),
                    'status_id' => ifset($parent_task, 'status_id', null)
                );

            }

            if (!is_array($task_ids) ) {
                $tasks = ifset($tasks, $task_ids, array());
            }
        }

        return $tasks;
    }
}