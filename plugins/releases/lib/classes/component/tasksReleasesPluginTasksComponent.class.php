<?php

class tasksReleasesPluginTasksComponent extends tasksReleasesPluginComponent
{
    protected $tasks;

    public function __construct($tasks = array())
    {
        $ids = waUtils::getFieldValues($tasks, 'id');

        $model = new tasksReleasesPluginTaskExtModel();
        $empty = $model->getEmptyRow();
        $ext_info = $model->getById($ids);
        foreach ($tasks as &$task) {
            $task['plugin_release_ext_info'] = $empty;
            if (isset($ext_info[$task['id']])) {
                $task['plugin_release_ext_info'] = $ext_info[$task['id']];
            }
        }
        unset($task);

        $this->tasks = $tasks;
    }

    public function getTypeHtml()
    {
        $tm = new tasksReleasesPluginTaskTypesModel();
        $types = $tm->getTypes();

        $assign = array(
            'types' => $types
        );

        $type_html = array();
        foreach ($this->tasks as $task) {
            $type_html[$task['id']] = '';

            $ext_info = $task['plugin_release_ext_info'];
            if ($ext_info['type'] === null || !isset($types[$ext_info['type']])) {
                continue;
            }

            $type_html[$task['id']] = $this->render("tasks/TaskType.html",
                array_merge($assign, array(
                    'task' => $task,
                    'task_type' => $types[$ext_info['type']]
                ))
            );
        }
        return $type_html;
    }


    public function getFieldsHtml()
    {
        $assign = array(
            'gravities' => tasksReleasesPluginTaskExtModel::getGravities(),
            'resolutions' => tasksReleasesPluginTaskExtModel::getResolutions(),
            'field_names' => tasksReleasesPluginTaskExtModel::getFieldNames(),
        );

        $blocks = array();
        foreach ($this->tasks as $task) {
            $blocks[$task['id']] = $this->render("tasks/Task.html",
                array_merge($assign, array(
                    'task' => $task
                ))
            );
        }

        return $blocks;
    }

    public function getButtonsHtml()
    {
        $blocks = array();
        foreach ($this->tasks as $task) {
            $milestone_id = $task->milestone_id;
            if (empty($milestone_id)) {
                $blocks[$task['id']] = $this->render("tasks/TaskButtons.html", [
                        'task_id' => $task->id,
                    ]
                );
            }
        }

        return $blocks;
    }

    public function getButtonsScript()
    {
        return $this->render("tasks/TaskButtonsScript.html");
    }
}
