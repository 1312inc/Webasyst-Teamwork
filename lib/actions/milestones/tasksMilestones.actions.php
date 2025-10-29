<?php

class tasksMilestonesActions extends waViewActions
{
    protected function defaultAction()
    {
        $this->view->assign(array(
            'milestones' => self::getMilestones(),
            'projects'   => tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray(),
        ));
    }

    protected static function getMilestones()
    {
        $contacts = [];
        $scope_counts = [];
        $milestone_model = new tasksMilestoneModel();
        $milestones = $milestone_model->getMilestonesWithOrder();

        $projects = tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray();
        $project_model = new tasksProjectModel();

        tasksMilestoneModel::workup($milestones);

        if ($milestone_ids = array_keys($milestones)) {
            $log_model = new tasksTaskLogModel();
            $contacts = $log_model->getContactByMilestone($milestone_ids);

            $task_model = new tasksTaskModel();
            $scope_counts = $task_model->getCountTasksInScope();
        }
        foreach($milestones as $mid => &$m) {
            if (!empty($projects[$m['project_id']])) {
                $m['project'] = $projects[$m['project_id']];
            } else if (wa()->getUser()->isAdmin('tasks')) {
                $m['project'] = tasksHelper::extendIcon($project_model->getEmptyRow());
                $m['project']['name'] = 'deleted project_id='.$m['project_id'];
            } else {
                unset($milestones[$mid]);
                continue;
            }

            $m['closed_percent'] = null;
            $m['users'] = ifset($contacts, $m['id'], []);
            $m['statuses'] = array(
                array(
                    'bg_color' => 'transparent',
                    'percent' => 0,
                    'name' => '',
                ),
            );
            if ($count = ifset($scope_counts, $mid, [])) {
                $percent = $count['total'] ? $count['closed'] / $count['total'] * 100 : 0;
                $m['closed_percent'] = round($percent);
            }
        }
        unset($m);

        foreach($milestone_model->getMilestoneStatuses() as $mid => $statuses) {
            if (!empty($milestones[$mid])) {
                $milestones[$mid]['statuses'] = $statuses;
            }
        }

        return $milestones;
    }

    protected function editAction()
    {
        $milestone_id = wa()->getRequest()->request('id');
        if (!$this->getUser()->isAdmin('tasks')) {
            $this->accessDenied();
        }

        $milestone_model = new tasksMilestoneModel();
        $milestones = $milestone_model->getMilestonesWithOrder();
        tasksMilestoneModel::workup($milestones, ['extra' => 'project']);
        if ($milestone_id === 'new') {
            $milestone = $milestone_model->getEmptyRow();
        } elseif ($milestone_id > 0) {
            $milestone = ifset($milestones, $milestone_id, null);
        } else {
            $milestone = null;
        }
        if (!$milestone) {
            $this->notFound();
        }

        $saved = false;
        $errors = array();
        if ($post = wa()->getRequest()->post('milestone')) {
            $errors = array();

            if ($milestone_id === 'new' && empty($post['start_date'])) {
                $post['start_date'] = date('Y-m-d');
            }
            if ($milestone_id !== 'new' && ifset($milestone, 'closed', '0') == 0 && ifset($post, 'closed', '0') == 1) {
                $post['end_date'] = date('Y-m-d');
            }

            $related_projects = wa()->getRequest()->post('tasks_milestone_project', []);
            $result = $this->saveMilestone($milestone, $post, $related_projects, $errors);
            if ($result) {
                $saved = true;
                $milestone = $result;
            }
        }

        $this->view->assign([
            'milestone'     => $milestone,
            'milestones'    => $milestones,
            'projects'      => tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray(),
            'errors'        => $errors,
            'saved'         => $saved,
            'sidebar_html'  => $this->getSidebarHtml(),
            'projects_html' => $this->getProjectsHtml($milestone)
        ]);

        $this->view->assign('backend_milestone_edit', $this->triggerEditEvent($milestone));
    }

    protected function getSidebarHtml()
    {
        $sidebar = new tasksSettingsSidebarAction();
        return $sidebar->display();
    }

    protected function getProjectsHtml($milestone)
    {
        $related_projects = [];
        $view = wa()->getView();
        if (!empty($milestone['id'])) {
            $m = new tasksMilestoneProjectsModel();
            $related_projects = $m->getRelatedProjectIds($milestone['id']);
        }
        $view->assign([
            'projects'         => tasksHelper::getProjects(),
            'related_projects' => $related_projects
        ]);

        return $view->fetch(wa()->getAppPath('templates/actions/milestones/MilestonesProjects.inc.html', 'tasks'));
    }

    protected function triggerEditEvent($milestone)
    {
        /**
         * UI hook for extend milestone editor
         *
         * @event backend_milestone_edit
         * @param array $params
         * @return array[string]array $return[%plugin_id%] array of html output
         * @return string $return[%plugin_id%]['more'] html output
         *
         */
        $params = array(
            'milestone' => $milestone
        );
        return wa()->event('backend_milestone_edit', $params);
    }

    protected function triggerSaveEvent($milestone, $params)
    {
        /**
         * Save milestone event hook
         *
         * @param array $milestone
         * @param string type 'add' | 'edit'
         * @param null|array $prev_milestone
         * @event milestone_save
         */
        $params['milestone'] = $milestone;
        wa()->event('milestone_save', $params);
    }

    protected function saveMilestone($milestone, $data, $related_projects, &$errors)
    {
        $model = new tasksMilestoneModel();

        $data = array_intersect_key($data, $model->getEmptyRow()) + $model->getEmptyRow();
        unset($data['id']);

        if (empty($data['name'])) {
            $errors['milestone[name]'] = _w('This field is required.');
        }

        $projects = tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray();
        if (empty($data['project_id']) || empty($projects[$data['project_id']])) {
            $errors['milestone[project_id]'] = _w('This field is required.');
        }

        $data['due_date'] = ifempty($data['due_date'], null);
        $data['public_hash'] = ifempty($data['public_hash'], null);
        if ($data['due_date']) {
            $ts = @strtotime($data['due_date']);
            if ($ts) {
                $data['due_date'] = date('Y-m-d', $ts);
            } else {
                $data['due_date'] = null;
            }
        }

        if ($errors) {
            return false;
        }

        $hook_params = array();
        if ($milestone['id'] > 0) {
            $id = $milestone['id'];
            $hook_params['prev_milestone'] = $milestone;
            $model->updateById($id, $data);
            $hook_params['type'] = 'edit';
        } else {
            $id = $model->insert($data);
            $hook_params['type'] = 'add';
        }

        $milestone = $model->getById($id);

        if ($related_projects) {
            foreach ($related_projects as $index => $project_id) {
                if ($id == $project_id || !isset($projects[$project_id])) {
                    unset($related_projects[$index]);
                }
            }
            $m = new tasksMilestoneProjectsModel();
            $m->saveRelatedProjects($id, $related_projects);
        }


        $this->triggerSaveEvent($milestone, $hook_params);

        return $milestone;
    }

    protected function notFound()
    {
        throw new waException(_w('Scope not found'), 404);
    }

    protected function accessDenied()
    {
        throw new waRightsException(_w('Access denied'));
    }

    protected function deleteAction()
    {
        $id = (int)$this->getRequest()->post('id');
        try {
            (new tasksApiMilestoneDeleteHandler())->delete(new tasksApiMilestoneDeleteRequest($id));

            echo json_encode(array(
                'status' => 'ok',
                'data' => $id,
            ));
        } catch (tasksAccessException $accessException) {
            $this->accessDenied();
        }

        exit;
    }
}

