<?php
/**
 * Project editor and creation form, and submit controller for it.
 */
class tasksProjectsEditAction extends waViewAction
{
    public function execute()
    {
        $project_model = new tasksProjectModel();
        $projects = tsks()->getEntityRepository(tasksProject::class)
            ->getProjectsAsArray(tasksProjectRepository::GET_PROJECT_ALL);
        $statuses = tasksHelper::getStatuses(null, false);

        $project = null;
        $id = waRequest::request('id');
        if ($id == 'new' || $id == 'add') {
            $project = tasksHelper::extendIcon(array(
                'color' => 't-white',
                'icon' => 'blog',
            ) + $project_model->getEmptyRow());
        } else if (!empty($projects[$id])) {
            $project = $projects[$id];
        }
        if (!$project) {
            throw new waException('Project not found', 404);
        }

        $saved = false;
        $errors = array();
        $data = waRequest::post('project');
        if ($data) {
            $data = array_intersect_key($data, $project) + $project;
            $data = array_diff_key($data, array(
                'id' => '',
                'contact_id' => '',
                'create_datetime' => '',
                'task_nmber' => '',
            ));
            if (empty($data['name'])) {
                $errors['project[name]'] = _ws('This field is required.');
            }
            if (waRequest::post('icon_url', '', 'string')) {
                $data['icon'] = waRequest::post('icon_url', '', 'string');
            }

            $workflow = waRequest::post('workflow', '', 'string');
            if ($workflow == 'custom') {
                $custom_workflow = waRequest::post('custom_workflow', array(), 'array');
            } else {
                $custom_workflow = array_fill_keys(explode(',', $workflow), 1);
            }
            $new_statuses = array();
            foreach($statuses as $s) {
                if (empty($s['special']) && !empty($custom_workflow[$s['id']])) {
                    $new_statuses[$s['id']] = $s['id'];
                }
            }

            if (!$errors) {
                $saved = true;
                if ($project['id']) {
                    $project_model->updateById($project['id'], $data);
                } else {
                    $project['id'] = $project_model->add($data);
                }

                $project = $project_model->getById($project['id']);
                if (empty($project)) {
                    throw new waException('Error saving project', 500); // being paranoid
                }

                $project_statuses_model = new tasksProjectStatusesModel();
                $project_statuses_model->setStatuses($project['id'], $new_statuses);
                $projects[$project['id']] = $project = tasksHelper::extendIcon($project);
            } else {
                $project = $data + $project;
            }
        }

        $active_projects = $archive_projects = array();
        foreach ($projects as $row) {
            if ($row['archive_datetime']) {
                $archive_projects[$row['id']] = $row;
            } else {
                $active_projects[$row['id']] = $row;
            }
        }

        $project_tasks_count = 0;
        if ($project['id']) {
            $collection = new tasksCollection('project/'.$project['id']);
            $project_tasks_count = $collection->count();
        }

        $this->view->assign(array(
            'icons' => wa()->getConfig()->getProjectIcons(),
            'colors' => wa()->getConfig()->getProjectColors(),
            'project_statuses' => tasksHelper::getStatuses($project['id']),
            'workflows' => self::getWorkflows($projects, (int) ifempty($project['id'])),
            'statuses' => $statuses,
            'projects' => $active_projects,
            'archive_projects' => $archive_projects,
            'project_tasks_count' => $project_tasks_count,
            'project' => $project,
            'errors' => $errors,
            'saved' => $saved,
            'sidebar_html' => $this->getSidebarHtml()
        ));
    }

    /** Get unique workflows across all projects */
    protected static function getWorkflows($projects, $project_id)
    {
        $workflows = array();
        $something_selected = false;
        foreach($projects as $p) {
            $statuses = tasksHelper::getStatuses($p['id']);
            $wf_id = join(',', array_keys($statuses));
            if (empty($workflows[$wf_id])) {
                $workflows[$wf_id] = array(
                    'project' => $p,
                    'statuses' => $statuses,
                    'selected' => false,
                );
            }

            // Selected workflow should be on top of the list
            if ($project_id == $p['id']) {
                $something_selected = true;
                $workflows = array(
                    $wf_id => array(
                        'project' => $p,
                        'selected' => 1,
                    ) + $workflows[$wf_id],
                ) + $workflows;
            }
        }

        if ($workflows && !$something_selected) {
            $workflows[key($workflows)]['selected'] = true;
        }

        return $workflows;
    }

    protected function getSidebarHtml()
    {
        $sidebar = new tasksSettingsSidebarAction();
        return $sidebar->display();
    }
}

