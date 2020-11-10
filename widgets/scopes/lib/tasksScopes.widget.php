<?php

class tasksScopesWidget extends waWidget
{
    public function defaultAction()
    {
        $this->display(array(
            'widget_id' => $this->id,
            'scopes' => $this->getScopes(),
            'widget_url' => $this->getStaticUrl(),
            'title' => $this->getSettings('title')
        ));
    }

    protected function getScopes()
    {
        $offset = $this->getOffset();
        $limit = $this->getLimit();

        $scopes = $this->fetchScopes($offset, $limit);

        if (!$scopes && $offset > 0) {   // if somehow page is empty, force to go to the first page
            $offset = 0;
            $scopes = $this->fetchScopes($offset, $limit);
        } elseif (count($scopes) < $limit) { // it's last page, set offset to first page
            $offset = 0;
        } else {
            $offset += $limit;
        }

        $this->setOffset($offset);

        return $scopes;

    }

    protected function fetchScopes($offset, $limit)
    {
        $mm = new tasksMilestoneModel();

        $projects = tasksHelper::getProjects('all');
        $project_ids = array_keys($projects);
        if (!$project_ids) {
            return array();
        }

        $offset = (int)$offset;
        $limit = (int)$limit;

        $scopes = $mm
            ->select('*')
            ->where("project_id IN (?) AND closed=0 AND due_date IS NOT NULL", array($project_ids))
            ->order("`due_date` ASC, `id`")
            ->limit("{$offset},{$limit}")
            ->fetchAll('id');

        foreach ($scopes as &$scope) {
            $project = $projects[$scope['project_id']];
            $scope['icon_html'] = $project['icon_html'];
            $scope['progress'] = 0;
        }
        unset($scope);

        // Calculate percent closed tasks
        $tm = new tasksTaskModel();
        $scope_counts = $tm->getCountTasksInScope();
        foreach ($scope_counts as $count) {
            if (isset($scopes[$count['milestone_id']])) {
                $percent = $count['closed'] / $count['total'] * 100;
                $percent = round($percent);
                $scopes[$count['milestone_id']]['progress'] = $percent;
            }
        }

        tasksMilestoneModel::workup($scopes);

        return $scopes;
    }

    protected function getLimit()
    {
        return 5;
    }

    protected function getOffset()
    {
        $offset = (int)$this->getSettings('offset');
        $offset = $offset > 0 ? $offset : 0;
        return $offset;
    }

    protected function setOffset($offset)
    {
        $offset = (int)$offset;
        $offset = $offset > 0 ? $offset : 0;
        $this->setOneSettingValue('offset', $offset);
    }

    protected function setOneSettingValue($name, $value)
    {
        $settings = $this->getSettings();
        $settings[$name] = $value;
        $this->setSettings($settings);
    }
}
