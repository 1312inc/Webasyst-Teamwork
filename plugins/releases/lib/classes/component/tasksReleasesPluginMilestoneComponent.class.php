<?php

class tasksReleasesPluginMilestoneComponent extends tasksReleasesPluginComponent
{
    protected $milestone;

    public function __construct($milestone, $options = array())
    {
        $m = new tasksMilestoneModel();
        if (wa_is_int($milestone)) {
            $milestone = $m->getById($milestone);
        }
        if (!is_array($milestone) && !isset($milestone['id'])) {
            $milestone = $m->getEmptyRow();
        }
        $this->milestone = $milestone;
    }

    public function getEditHtml()
    {
        $projects = tasksHelper::getProjects();
        $m = new tasksReleasesPluginMilestoneProjectsModel();
        $related_projects = $m->getRelatedProjectIds($this->milestone['id']);
        return $this->render("milestone/Edit.html", array(
            'projects' => $projects,
            'related_projects' => $related_projects
        ));
    }

    public function save()
    {
        $post = wa()->getRequest()->post();

        $related_projects = array();
        if (isset($post['tasks_plugin_releases_milestone_project'])) {
            $related_projects = $post['tasks_plugin_releases_milestone_project'];
        }
        if (!is_array($related_projects)) {
            $related_projects = array();
        }

        $projects = tasksHelper::getProjects();
        foreach ($related_projects as $index => $project_id) {
            if ($this->milestone['project_id'] == $project_id || !isset($projects[$project_id])) {
                unset($related_projects[$index]);
            }
        }

        $m = new tasksReleasesPluginMilestoneProjectsModel();
        $m->saveRelatedProjects($this->milestone['id'], $related_projects);
    }
}
