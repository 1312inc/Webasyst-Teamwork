<?php

class tasksReleasesPluginTaskComponent extends tasksReleasesPluginComponent
{
    protected $task;

    public function __construct($task, $options = array())
    {
        if (wa_is_int($task)) {
            $task = new tasksTaskObj($task);
        } elseif (is_array($task)) {
            $task = new tasksTaskObj($task);
        }
        if (!($task instanceof tasksTaskObj)) {
            $task = new tasksTaskObj();
        }
        $this->task = $task;
    }

    public function getTypeSelectorHtml()
    {
        $em = new tasksReleasesPluginTaskExtModel();
        if ($this->task['id'] > 0) {
            $ext_info = $em->getById($this->task['id']);
        } else {
            $ext_info = $em->getEmptyRow();
        }
        $tm = new tasksReleasesPluginTaskTypesModel();
        $types = $tm->getTypes();
        return $this->render("task/TypeSelector.html", array(
            'task' => $this->task,
            'types' => $types,
            'ext_info' => $ext_info
        ));
    }

    public function getEditHtml()
    {
        $em = new tasksReleasesPluginTaskExtModel();
        if ($this->task['id'] > 0) {
            $ext_info = $em->getById($this->task['id']);
        } else {
            $ext_info = $em->getEmptyRow();
        }
        return $this->render("task/Edit.html", array(
            'task' => $this->task,
            'gravities' => tasksReleasesPluginTaskExtModel::getGravities(),
            'resolutions' => tasksReleasesPluginTaskExtModel::getResolutions(),
            'field_names' => tasksReleasesPluginTaskExtModel::getFieldNames(),
            'ext_info' => $ext_info,
            'milestones' => $this->getMilestones()
        ));
    }

    protected function getMilestones()
    {
        $milestone_model = new tasksMilestoneModel();
        $milestones = $milestone_model->where('closed=0')->order('due_date')->fetchAll('id');
        $relation_model = new tasksReleasesPluginMilestoneProjectsModel();
        $related_projects = $relation_model->getRelatedProjectIds(array_keys($milestones));
        foreach ($milestones as &$milestone) {
            $milestone['related_projects'] = $related_projects[$milestone['id']];
            $milestone['related_projects'][] = $milestone['project_id'];
            $milestone['related_projects'] = array_unique($milestone['related_projects']);
            // important for js, don't touch it
            $milestone['related_projects'] = tasksHelper::toIntArray($milestone['related_projects']);
        }
        unset($milestone);

        return $milestones;
    }

    public function save()
    {
        $post = wa()->getRequest()->post();
        $data = array();
        if (isset($post['task_plugin_releases_task_ext'])) {
            $data = $post['task_plugin_releases_task_ext'];
        }
        if (!is_array($data)) {
            $data = array();
        }
        if (!$data) {
            return false;
        }
        $data['task_id'] = $this->task['id'];
        $model = new tasksReleasesPluginTaskExtModel();
        return $model->save($data);
    }
}
