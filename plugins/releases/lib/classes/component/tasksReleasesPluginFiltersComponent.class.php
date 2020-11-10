<?php

class tasksReleasesPluginFiltersComponent extends tasksReleasesPluginComponent
{
    public function getFilterBlocks()
    {
        return array(
            $this->render("filters/Type.html", array(
                'types' => $this->getTypes(),
                'milestones' => $this->getMilestones()
            )),
            $this->render("filters/Gravity.html", array(
                'gravities' => tasksReleasesPluginTaskExtModel::getGravities()
            )),
            $this->render("filters/Resolution.html", array(
                'resolutions' => tasksReleasesPluginTaskExtModel::getResolutions()
            ))
        );
    }

    protected function getTypes($with_empty = true)
    {
        $tm = new tasksReleasesPluginTaskTypesModel();
        $types = $tm->getTypes();
        if ($with_empty) {
            $types = array(
                '' => $tm->getEmptyRow()
            ) + $types;
        }
        return $types;
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

    public function applyFilters(tasksCollection $collection, $conditions)
    {
        $model = new tasksReleasesPluginTaskExtModel();

        $filters = array();
        foreach ($conditions as $condition) {
            if (substr($condition['field'], 0, 16) === 'plugin.releases.') {
                $field = substr($condition['field'], 16);
                if ($model->fieldExists($field)) {
                    $condition['field'] = $field;
                    $filters[] = $condition;
                }
            }
        }

        if (!$filters) {
            return;
        }

        $alias = $collection->addJoin($model->getTableName(), 't.id = :table.task_id');
        foreach ($filters as $filter) {
            $collection->addWhere("{$alias}.{$filter['field']} {$filter['expression']}");
        }
    }
}
