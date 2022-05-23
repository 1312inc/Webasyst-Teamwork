<?php

class tasksMilestonesActions extends waViewActions
{
    protected function defaultAction()
    {
        $this->view->assign(array(
            'milestones' => self::getMilestones(),
        ));
    }

    protected static function getMilestones()
    {
        $milestone_model = new tasksMilestoneModel();
        $milestones = $milestone_model->getMilestonesWithOrder(false);

        $projects = tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray();
        $project_model = new tasksProjectModel();

        tasksMilestoneModel::workup($milestones);

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

            $m['statuses'] = array(
                array(
                    'bg_color' => 'transparent',
                    'percent' => 0,
                    'name' => '',
                ),
            );
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
        if (!$this->getUser()->isAdmin('tasks')) {
            $this->accessDenied();
        }
        
        $milestone = $this->getMilestone();

        $saved = false;
        $errors = array();
        $post = wa()->getRequest()->post('milestone');
        if ($post) {
            $errors = array();
            $result = $this->saveMilestone($milestone, $post, $errors);
            if ($result) {
                $saved = true;
                $milestone = $result;
            }
        }

        $this->view->assign(array(
            'milestone' => $milestone,
            'projects' => tsks()->getEntityRepository(tasksProject::class)->getProjectsAsArray(),
            'errors' => $errors,
            'saved' => $saved,
            'sidebar_html' => $this->getSidebarHtml()
        ));

        $this->view->assign('backend_milestone_edit', $this->triggerEditEvent($milestone));
    }

    protected function getSidebarHtml()
    {
        $sidebar = new tasksSettingsSidebarAction();
        return $sidebar->display();
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

    protected function saveMilestone($milestone, $data, &$errors)
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

        $this->triggerSaveEvent($milestone, $hook_params);

        return $milestone;
    }

    protected function getMilestone()
    {
        $m = new tasksMilestoneModel();
        $id = wa()->getRequest()->request('id');
        if ($id === 'new') {
            $milestone = $m->getEmptyRow();
        } elseif ($id > 0) {
            $milestone = $m->getById((int)$id);
        } else {
            $milestone = null;
        }
        if (!$milestone) {
            $this->notFound();
        }
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

